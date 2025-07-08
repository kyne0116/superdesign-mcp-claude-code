# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Build**: `npm run build` - Compiles TypeScript to JavaScript in `dist/`
- **Development**: `npm run dev` - Run server in development mode with tsx
- **Start**: `npm run start` - Run the compiled server from `dist/index.js`

## Architecture

This is an MCP (Model Context Protocol) server that extends Claude Code with additional development tools. The architecture consists of:

**Core Components:**
- `src/index.ts` - Main MCP server implementation using @modelcontextprotocol/sdk
- Single-file server that handles tool registration and execution
- Uses stdio transport for communication with Claude Code

**Tool Implementation Pattern:**
- Each tool has a Zod schema for input validation (e.g., `BashToolSchema`, `ReadToolSchema`)
- Tools are registered in `ListToolsRequestSchema` handler with JSON schemas
- Tool execution handled in `CallToolRequestSchema` handler with switch statement
- All tools return standardized `{ content: [{ type: "text", text: result }] }` format

**Available Tools:**
- `bash` - Shell command execution with configurable timeout (default 120s)
- `read` - File reading with optional line offset/limit, returns numbered lines
- `write` - File writing with UTF-8 encoding
- `edit` - Text replacement in files (single or all occurrences)
- `glob` - File pattern matching using glob library
- `grep` - Content search using ripgrep (`rg` command)
- `ls` - Directory listing using system `ls -la`

**Error Handling:**
- Input validation through Zod schemas
- File existence checks before operations
- Graceful error responses for failed operations
- Command execution errors caught and returned as text

## MCP Integration

The server integrates with Claude Code through the MCP protocol. Add to Claude Code with:
```bash
claude mcp add --scope user superdesign ~/superdesign/dist/index.js
```

The server must be built before use, as Claude Code runs the compiled JavaScript from `dist/index.js`.