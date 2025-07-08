# Superdesign MCP Server

An MCP (Model Context Protocol) server that provides development tools for Claude Code, extending its capabilities with additional file system and shell tools.

## Installation

1. Install dependencies:
```bash
npm install
```

2. Build the server:
```bash
npm run build
```

## Claude Code Integration

1. Add the MCP server to your Claude Code configuration:
```bash
# Create or edit your Claude Code MCP settings file
# On macOS:
mkdir -p ~/.claude-code
cp claude-mcp-config.json ~/.claude-code/mcp-settings.json

# Or add manually to your existing mcp-settings.json:
```

Example `~/.claude-code/mcp-settings.json`:
```json
{
  "mcpServers": {
    "superdesign": {
      "command": "node",
      "args": ["/Users/jongrant/superdesign/dist/index.js"],
      "env": {}
    }
  }
}
```

2. Restart Claude Code

3. The MCP server will provide these tools in Claude Code:
   - `bash` - Execute shell commands
   - `read` - Read file contents
   - `write` - Write files
   - `edit` - Edit files with find/replace
   - `glob` - Find files by pattern
   - `grep` - Search file contents
   - `ls` - List directories

## Development

Run in development mode:
```bash
npm run dev
```

## Tools Available

### bash
Execute shell commands with optional timeout.

### read
Read file contents from the filesystem with optional line limits and offsets.

### write
Write content to files.

### edit
Edit files by replacing specific text strings.

### glob
Find files matching glob patterns.

### grep
Search for text patterns in files using ripgrep.

### ls
List files and directories.

## Usage in Claude Code

Once configured, Claude Code will have access to these additional tools through the MCP server. The server runs locally and provides extended file system access and shell command execution capabilities beyond the default Claude Code tools.