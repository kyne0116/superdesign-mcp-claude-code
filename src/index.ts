#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { execSync, spawn } from "child_process";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { glob } from "glob";

const server = new Server(
  {
    name: "superdesign-mcp-server",
    version: "1.0.0",
  }
);

// Tool schemas
const BashToolSchema = z.object({
  command: z.string(),
  description: z.string().optional(),
  timeout: z.number().optional(),
});

const ReadToolSchema = z.object({
  file_path: z.string(),
  limit: z.number().optional(),
  offset: z.number().optional(),
});

const WriteToolSchema = z.object({
  file_path: z.string(),
  content: z.string(),
});

const EditToolSchema = z.object({
  file_path: z.string(),
  old_string: z.string(),
  new_string: z.string(),
  replace_all: z.boolean().optional(),
});

const GlobToolSchema = z.object({
  pattern: z.string(),
  path: z.string().optional(),
});

const GrepToolSchema = z.object({
  pattern: z.string(),
  include: z.string().optional(),
  path: z.string().optional(),
});

const LSToolSchema = z.object({
  path: z.string(),
  ignore: z.array(z.string()).optional(),
});

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "bash",
        description: "Execute bash commands with optional timeout",
        inputSchema: {
          type: "object",
          properties: {
            command: { type: "string", description: "The command to execute" },
            description: { type: "string", description: "Description of what the command does" },
            timeout: { type: "number", description: "Optional timeout in milliseconds" },
          },
          required: ["command"],
        },
      },
      {
        name: "read",
        description: "Read file contents from the filesystem",
        inputSchema: {
          type: "object",
          properties: {
            file_path: { type: "string", description: "Absolute path to the file" },
            limit: { type: "number", description: "Number of lines to read" },
            offset: { type: "number", description: "Line number to start reading from" },
          },
          required: ["file_path"],
        },
      },
      {
        name: "write",
        description: "Write content to a file",
        inputSchema: {
          type: "object",
          properties: {
            file_path: { type: "string", description: "Absolute path to the file" },
            content: { type: "string", description: "Content to write" },
          },
          required: ["file_path", "content"],
        },
      },
      {
        name: "edit",
        description: "Edit file by replacing text",
        inputSchema: {
          type: "object",
          properties: {
            file_path: { type: "string", description: "Absolute path to the file" },
            old_string: { type: "string", description: "Text to replace" },
            new_string: { type: "string", description: "Replacement text" },
            replace_all: { type: "boolean", description: "Replace all occurrences" },
          },
          required: ["file_path", "old_string", "new_string"],
        },
      },
      {
        name: "glob",
        description: "Find files matching a pattern",
        inputSchema: {
          type: "object",
          properties: {
            pattern: { type: "string", description: "Glob pattern to match" },
            path: { type: "string", description: "Directory to search in" },
          },
          required: ["pattern"],
        },
      },
      {
        name: "grep",
        description: "Search for patterns in file contents",
        inputSchema: {
          type: "object",
          properties: {
            pattern: { type: "string", description: "Regex pattern to search for" },
            include: { type: "string", description: "File pattern to include" },
            path: { type: "string", description: "Directory to search in" },
          },
          required: ["pattern"],
        },
      },
      {
        name: "ls",
        description: "List files and directories",
        inputSchema: {
          type: "object",
          properties: {
            path: { type: "string", description: "Absolute path to list" },
            ignore: { type: "array", items: { type: "string" }, description: "Patterns to ignore" },
          },
          required: ["path"],
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "bash": {
        const { command, timeout = 120000 } = BashToolSchema.parse(args);
        try {
          const result = execSync(command, {
            encoding: "utf8",
            timeout,
            maxBuffer: 1024 * 1024 * 10, // 10MB
          });
          return {
            content: [{ type: "text", text: result }],
          };
        } catch (error: any) {
          return {
            content: [{ type: "text", text: `Error: ${error.message}` }],
          };
        }
      }

      case "read": {
        const { file_path, limit, offset } = ReadToolSchema.parse(args);
        try {
          if (!existsSync(file_path)) {
            return {
              content: [{ type: "text", text: `Error: File ${file_path} does not exist` }],
            };
          }
          
          const content = readFileSync(file_path, "utf8");
          const lines = content.split("\n");
          
          const startLine = offset || 0;
          const endLine = limit ? startLine + limit : lines.length;
          const selectedLines = lines.slice(startLine, endLine);
          
          const numberedLines = selectedLines
            .map((line, index) => `${startLine + index + 1}\t${line}`)
            .join("\n");
          
          return {
            content: [{ type: "text", text: numberedLines }],
          };
        } catch (error: any) {
          return {
            content: [{ type: "text", text: `Error reading file: ${error.message}` }],
          };
        }
      }

      case "write": {
        const { file_path, content } = WriteToolSchema.parse(args);
        try {
          writeFileSync(file_path, content, "utf8");
          return {
            content: [{ type: "text", text: `File written successfully to ${file_path}` }],
          };
        } catch (error: any) {
          return {
            content: [{ type: "text", text: `Error writing file: ${error.message}` }],
          };
        }
      }

      case "edit": {
        const { file_path, old_string, new_string, replace_all } = EditToolSchema.parse(args);
        try {
          if (!existsSync(file_path)) {
            return {
              content: [{ type: "text", text: `Error: File ${file_path} does not exist` }],
            };
          }
          
          let content = readFileSync(file_path, "utf8");
          
          if (replace_all) {
            content = content.replaceAll(old_string, new_string);
          } else {
            if (!content.includes(old_string)) {
              return {
                content: [{ type: "text", text: `Error: String not found in file` }],
              };
            }
            content = content.replace(old_string, new_string);
          }
          
          writeFileSync(file_path, content, "utf8");
          return {
            content: [{ type: "text", text: `File edited successfully` }],
          };
        } catch (error: any) {
          return {
            content: [{ type: "text", text: `Error editing file: ${error.message}` }],
          };
        }
      }

      case "glob": {
        const { pattern, path } = GlobToolSchema.parse(args);
        try {
          const files = await glob(pattern, { cwd: path || process.cwd() });
          return {
            content: [{ type: "text", text: files.join("\n") }],
          };
        } catch (error: any) {
          return {
            content: [{ type: "text", text: `Error: ${error.message}` }],
          };
        }
      }

      case "grep": {
        const { pattern, include, path } = GrepToolSchema.parse(args);
        try {
          let command = `rg "${pattern}" --type-add 'custom:*' --type custom`;
          if (include) {
            command += ` --glob "${include}"`;
          }
          if (path) {
            command += ` "${path}"`;
          }
          
          const result = execSync(command, {
            encoding: "utf8",
            cwd: path || process.cwd(),
          });
          return {
            content: [{ type: "text", text: result }],
          };
        } catch (error: any) {
          return {
            content: [{ type: "text", text: `No matches found` }],
          };
        }
      }

      case "ls": {
        const { path, ignore } = LSToolSchema.parse(args);
        try {
          let command = `ls -la "${path}"`;
          const result = execSync(command, { encoding: "utf8" });
          return {
            content: [{ type: "text", text: result }],
          };
        } catch (error: any) {
          return {
            content: [{ type: "text", text: `Error: ${error.message}` }],
          };
        }
      }

      default:
        return {
          content: [{ type: "text", text: `Unknown tool: ${name}` }],
        };
    }
  } catch (error: any) {
    return {
      content: [{ type: "text", text: `Error parsing arguments: ${error.message}` }],
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});