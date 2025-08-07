# Superdesign MCP 服务器

一个基于 MCP (Model Context Protocol) 的服务器，将 [Superdesign](https://github.com/superdesigndev/superdesign) - 由 [@jasonzhou1993](https://twitter.com/jasonzhou1993) 和 [@jackjack_eth](https://twitter.com/jackjack_eth) 开发的开源 AI 设计代理 - 作为原生工具集成到 Claude Code 中。该服务器作为"设计编排器"运行，为您的 IDE 中的 LLM 提供结构化规范，无需 Anthropic API 密钥即可实现 Superdesign 的强大设计功能。

## 🌟 主要特性

- **无需 API 密钥**：直接使用 Claude Code 的内置 LLM 连接
- **本地执行**：完全在您的机器上作为 MCP 服务器运行
- **IDE 集成**：与 Claude Code 无缝集成（也可能支持 Cursor、Windsurf 或其他兼容 MCP 的 IDE - 未测试）
- **基于开源**：构建在开源 AI 设计系统 [Superdesign.dev](https://www.superdesign.dev) 之上
- **智能设计编排**：提供结构化设计规范，而非直接生成
- **多种设计类型**：支持 UI 界面、线框图、组件、Logo、图标等
- **设计迭代**：支持基于反馈的设计改进和优化
- **可视化画廊**：内置交互式 HTML 画廊查看所有设计

## 📋 系统要求

### 支持的操作系统

- **Windows**: Windows 10/11 (x64)
- **macOS**: macOS 10.15+ (Intel 和 Apple Silicon)
- **Linux**: Ubuntu 18.04+, Debian 10+, CentOS 7+, Fedora 30+

### 软件依赖

- **Node.js**: 16.0.0 或更高版本
- **npm**: 7.0.0 或更高版本
- **Claude Code**: 最新版本（支持 MCP）

### 硬件要求

- **内存**: 最少 4GB RAM（推荐 8GB+）
- **存储**: 至少 500MB 可用空间
- **网络**: 互联网连接（用于下载依赖和 Claude Code 通信）

## 🚀 安装指南

### Windows 10/11 安装

#### 方法一：使用 PowerShell（推荐）

1. **安装 Node.js**

   ```powershell
   # 下载并安装 Node.js LTS 版本
   # 访问 https://nodejs.org/ 下载 Windows Installer (.msi)
   # 或使用 Chocolatey
   choco install nodejs

   # 验证安装
   node --version
   npm --version
   ```

2. **克隆项目**

   ```powershell
   # 克隆仓库
   git clone https://github.com/jonthebeef/superdesign-mcp-claude-code.git
   cd superdesign-mcp-claude-code
   ```

3. **安装依赖**

   ```powershell
   npm install
   ```

4. **构建项目**

   ```powershell
   npm run build
   ```

5. **配置 Claude Code MCP**

   ```powershell
   # 添加用户级别的MCP配置（推荐）
   claude mcp add --scope user superdesign node "$(Get-Location)\dist\index.js"

   # 验证配置
   claude mcp list
   ```

#### 方法二：使用 Windows Subsystem for Linux (WSL)

```bash
# 在 WSL 中按照 Linux 安装步骤进行
wsl --install
# 重启后在 WSL 中执行 Linux 安装步骤
```

### macOS 安装

#### 使用 Homebrew（推荐）

1. **安装 Homebrew**（如果尚未安装）

   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```

2. **安装 Node.js**

   ```bash
   # 安装 Node.js
   brew install node

   # 验证安装
   node --version
   npm --version
   ```

3. **克隆和构建项目**

   ```bash
   # 克隆仓库
   git clone https://github.com/jonthebeef/superdesign-mcp-claude-code.git
   cd superdesign-mcp-claude-code

   # 安装依赖
   npm install

   # 构建项目
   npm run build
   ```

4. **配置 Claude Code MCP**

   ```bash
   # 添加用户级别的MCP配置
   claude mcp add --scope user superdesign node "$(pwd)/dist/index.js"

   # 验证配置
   claude mcp list
   ```

#### 使用 Node Version Manager (nvm)

```bash
# 安装 nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# 重新加载终端或执行
source ~/.bashrc

# 安装并使用 Node.js LTS
nvm install --lts
nvm use --lts
```

### Linux 安装

#### Ubuntu/Debian

1. **更新包管理器**

   ```bash
   sudo apt update
   sudo apt upgrade -y
   ```

2. **安装 Node.js**

   ```bash
   # 方法一：使用 NodeSource 仓库（推荐）
   curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
   sudo apt-get install -y nodejs

   # 方法二：使用 snap
   sudo snap install node --classic

   # 验证安装
   node --version
   npm --version
   ```

3. **安装 Git**（如果尚未安装）

   ```bash
   sudo apt install git -y
   ```

4. **克隆和构建项目**

   ```bash
   # 克隆仓库
   git clone https://github.com/jonthebeef/superdesign-mcp-claude-code.git
   cd superdesign-mcp-claude-code

   # 安装依赖
   npm install

   # 构建项目
   npm run build

   # 添加执行权限（如果需要）
   chmod +x dist/index.js
   ```

5. **配置 Claude Code MCP**

   ```bash
   # 添加用户级别的MCP配置
   claude mcp add --scope user superdesign node "$(pwd)/dist/index.js"

   # 验证配置
   claude mcp list
   ```

#### CentOS/RHEL/Fedora

1. **CentOS/RHEL 安装**

   ```bash
   # 启用 EPEL 仓库
   sudo yum install epel-release -y

   # 安装 Node.js
   curl -fsSL https://rpm.nodesource.com/setup_lts.x | sudo bash -
   sudo yum install nodejs -y
   ```

2. **Fedora 安装**

   ```bash
   # 安装 Node.js
   sudo dnf install nodejs npm -y
   ```

3. **继续按照上述 Ubuntu 步骤 3-5 进行**

#### Arch Linux

```bash
# 安装 Node.js
sudo pacman -S nodejs npm

# 继续按照上述步骤进行
```

## ⚙️ 配置说明

### MCP 服务器配置

#### 配置作用域说明

Claude MCP 支持三种配置作用域：

| 作用域    | 描述           | 配置文件位置               | 使用场景                     |
| --------- | -------------- | -------------------------- | ---------------------------- |
| `user`    | 用户级全局配置 | `~/.claude.json`           | **推荐**：在任意目录都能使用 |
| `local`   | 当前目录配置   | `./claude-mcp-config.json` | 项目特定配置                 |
| `project` | 项目级配置     | `./.claude.json`           | 团队共享配置                 |

#### 推荐配置方式

**用户级配置（推荐）**：

```bash
# Windows PowerShell
claude mcp add --scope user superdesign node "D:\path\to\superdesign-mcp-claude-code\dist\index.js"

# macOS/Linux
claude mcp add --scope user superdesign node "/path/to/superdesign-mcp-claude-code/dist/index.js"
```

**项目级配置**：

```bash
# 在项目目录中
claude mcp add --scope project superdesign node "./dist/index.js"
```

#### 手动配置文件

如果需要手动编辑配置文件，可以创建或修改以下文件：

**用户级配置文件示例**：

```json
{
  "mcpServers": {
    "superdesign": {
      "command": "node",
      "args": ["/absolute/path/to/superdesign-mcp-claude-code/dist/index.js"],
      "env": {}
    }
  }
}
```

### 环境变量设置

#### Windows 环境变量

```powershell
# 设置 Node.js 路径（通常自动设置）
$env:PATH += ";C:\Program Files\nodejs"

# 设置项目路径（可选）
$env:SUPERDESIGN_PATH = "D:\path\to\superdesign-mcp-claude-code"
```

#### macOS/Linux 环境变量

```bash
# 添加到 ~/.bashrc 或 ~/.zshrc
export PATH="$PATH:/usr/local/bin"
export SUPERDESIGN_PATH="/path/to/superdesign-mcp-claude-code"

# 重新加载配置
source ~/.bashrc  # 或 source ~/.zshrc
```

### 高级配置选项

#### 自定义端口和传输方式

```json
{
  "mcpServers": {
    "superdesign": {
      "command": "node",
      "args": ["/path/to/dist/index.js"],
      "env": {
        "DEBUG": "true",
        "PORT": "3000"
      }
    }
  }
}
```

#### 多环境配置

```bash
# 开发环境
claude mcp add --scope local superdesign-dev tsx "src/index.ts"

# 生产环境
claude mcp add --scope user superdesign node "dist/index.js"
```

## 🔧 故障排除指南

### Windows 平台常见问题

#### 问题 1：路径依赖问题

**症状**：只能在特定目录下执行 `claude mcp list` 看到连接状态

```
# 在项目目录下：✓ Connected
# 在其他目录下：No MCP servers configured
```

**解决方案**：

```powershell
# 1. 移除错误配置
claude mcp remove superdesign

# 2. 使用绝对路径重新添加用户级配置
claude mcp add --scope user superdesign node "D:\完整\路径\到\superdesign-mcp-claude-code\dist\index.js"

# 3. 验证配置
claude mcp list
```

#### 问题 2：PowerShell 执行策略限制

**症状**：`无法加载文件，因为在此系统上禁止运行脚本`

**解决方案**：

```powershell
# 查看当前执行策略
Get-ExecutionPolicy

# 设置执行策略（以管理员身份运行）
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

#### 问题 3：Node.js 路径问题

**症状**：`'node' 不是内部或外部命令`

**解决方案**：

```powershell
# 检查 Node.js 安装
where node

# 如果未找到，重新安装 Node.js 或添加到 PATH
$env:PATH += ";C:\Program Files\nodejs"
```

### macOS 平台常见问题

#### 问题 1：权限被拒绝

**症状**：`Permission denied` 错误

**解决方案**：

```bash
# 添加执行权限
chmod +x dist/index.js

# 检查文件权限
ls -la dist/index.js
```

#### 问题 2：Homebrew 权限问题

**症状**：Homebrew 安装失败

**解决方案**：

```bash
# 修复 Homebrew 权限
sudo chown -R $(whoami) /usr/local/share/zsh /usr/local/share/zsh/site-functions

# 重新安装
brew install node
```

### Linux 平台常见问题

#### 问题 1：Node.js 版本过旧

**症状**：构建失败或运行时错误

**解决方案**：

```bash
# 检查版本
node --version

# 如果版本 < 16，使用 nvm 升级
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install --lts
nvm use --lts
```

#### 问题 2：npm 权限问题

**症状**：`EACCES: permission denied`

**解决方案**：

```bash
# 方法一：配置 npm 全局目录
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc

# 方法二：使用 nvm（推荐）
# 按照上述 nvm 安装步骤
```

### 通用问题解决

#### 问题 1：MCP 工具未出现

**症状**：Claude Code 中看不到 Superdesign 工具

**解决方案**：

```bash
# 1. 完全退出 Claude Code
# 2. 验证服务器注册
claude mcp list

# 3. 重启 Claude Code
# 4. 询问 Claude："你有哪些可用的工具？"
```

#### 问题 2：构建错误

**症状**：`npm run build` 失败

**解决方案**：

```bash
# 清理并重新安装
rm -rf node_modules package-lock.json
npm install
npm run build

# 检查 TypeScript 版本
npx tsc --version
```

#### 问题 3：服务器连接失败

**症状**：MCP 服务器显示 "Failed to connect"

**解决方案**：

```bash
# 1. 检查文件路径是否正确
ls -la /path/to/dist/index.js

# 2. 测试直接运行
node /path/to/dist/index.js

# 3. 重新注册服务器
claude mcp remove superdesign
claude mcp add --scope user superdesign node "/correct/path/to/dist/index.js"
```

#### 调试模式

启用调试模式获取更多信息：

```bash
# 开发模式运行
npm run dev

# 或直接运行并查看日志
node dist/index.js
```

## 📚 使用教程

### 基本命令使用

一旦配置完成，您可以在 Claude Code 中使用自然语言与 Superdesign 交互：

#### 设计生成命令

**UI 界面设计**：

```
生成一个现代化的仪表板UI设计
创建一个电商网站的首页设计
设计一个移动端的社交媒体应用界面
```

**线框图设计**：

```
创建一个博客网站的线框图
生成3个不同的登录页面线框图变体
设计一个管理后台的线框图布局
```

**组件设计**：

```
设计一个React产品卡片组件
创建一个Vue.js的导航栏组件
生成一个HTML的按钮组件库
```

**Logo 和图标**：

```
为科技初创公司设计一个简约Logo
创建一套社交媒体图标
设计一个电商平台的品牌标识
```

#### 设计迭代命令

```
改进仪表板设计，增加更好的间距
基于用户反馈优化登录页面的布局
让产品卡片组件更加现代化
```

#### 设计管理命令

```
显示我所有的设计作品
打开设计画廊查看所有创作
列出当前工作区的所有设计文件
```

### 常见使用场景示例

#### 场景 1：快速原型设计

```
用户：我需要为一个在线学习平台设计首页

Claude 会使用 superdesign_generate 工具：
- 生成3个不同风格的首页设计
- 包含响应式布局
- 遵循现代UI设计原则
- 自动保存到 superdesign/design_iterations/ 目录
```

#### 场景 2：设计迭代优化

```
用户：改进刚才的学习平台首页，让它更适合移动端

Claude 会使用 superdesign_iterate 工具：
- 读取现有设计文件
- 应用移动端优化建议
- 生成改进版本
- 保持设计一致性
```

#### 场景 3：组件库开发

```
用户：为我的React项目创建一套按钮组件

Claude 会：
- 生成多种按钮样式（主要、次要、危险等）
- 包含不同状态（正常、悬停、禁用）
- 提供完整的React代码
- 遵循可访问性标准
```

#### 场景 4：设计系统提取

```
用户：从这个截图中提取设计系统

Claude 会使用 superdesign_extract_system 工具：
- 分析颜色调色板
- 识别字体和排版规则
- 提取间距和布局模式
- 生成可重用的设计系统JSON文件
```

### API 接口说明

Superdesign MCP 服务器提供以下工具接口：

#### superdesign_generate

**功能**：生成新的设计作品
**参数**：

- `prompt` (string): 设计描述
- `design_type` (enum): 设计类型 - "ui", "wireframe", "component", "logo", "icon"
- `variations` (number): 变体数量 (1-5, 默认 3)
- `framework` (enum): 框架类型 - "html", "react", "vue" (默认 html)

**返回**：结构化的设计规范，包含 Superdesign 系统提示、文件命名模式和设计指南

#### superdesign_iterate

**功能**：迭代改进现有设计
**参数**：

- `design_file` (string): 现有设计文件路径
- `feedback` (string): 改进建议
- `variations` (number): 变体数量 (1-5, 默认 3)

**返回**：迭代规范，包含原始设计内容、反馈应用指南和 Superdesign 原则

#### superdesign_extract_system

**功能**：从截图提取设计系统
**参数**：

- `image_path` (string): 截图/图像文件路径

**返回**：提取规范和 JSON 模式，用于分析图像并创建设计系统文件

#### superdesign_list

**功能**：列出工作区中的所有设计
**参数**：

- `workspace_path` (string, 可选): 工作区路径（默认当前目录）

**返回**：设计迭代、提取的设计系统和文件组织的完整列表

#### superdesign_gallery

**功能**：生成交互式 HTML 画廊
**参数**：

- `workspace_path` (string, 可选): 工作区路径（默认当前目录）

**返回**：带有嵌入预览和 JavaScript 交互的画廊 HTML 文件

#### superdesign_delete

**功能**：删除指定的设计文件
**参数**：

- `filename` (string): 要删除的设计文件名

**返回**：删除操作的确认信息

### 文件组织结构

Superdesign 自动创建以下目录结构：

```
项目根目录/
├── superdesign/
│   ├── design_iterations/          # 生成的设计文件
│   │   ├── ui_dashboard_v1.html
│   │   ├── ui_dashboard_v2.html
│   │   ├── logo_startup_v1.svg
│   │   └── component_button_v1.html
│   ├── design_system/              # 提取的设计系统
│   │   ├── extracted_system_1.json
│   │   └── color_palette.json
│   ├── gallery.html                # 自动生成的画廊
│   └── metadata.json               # 设计元数据
```

### 高级使用技巧

#### 1. 批量设计生成

```
为电商平台生成完整的设计系统：
- 首页UI设计
- 产品列表页面
- 购物车组件
- 用户登录界面
- 移动端适配版本
```

#### 2. 设计版本管理

```
基于用户反馈迭代设计：
1. 生成初始版本
2. 收集反馈
3. 使用 superdesign_iterate 改进
4. 重复直到满意
5. 使用画廊比较所有版本
```

#### 3. 团队协作

```
团队设计工作流：
1. 设计师创建初始设计
2. 开发者使用组件生成工具
3. 产品经理通过画廊审查
4. 基于反馈进行迭代
```

## 🛠️ 开发指南

### 开发环境设置

#### 克隆和设置开发环境

```bash
# 克隆仓库
git clone https://github.com/jonthebeef/superdesign-mcp-claude-code.git
cd superdesign-mcp-claude-code

# 安装依赖
npm install

# 安装开发依赖
npm install --save-dev @types/node tsx typescript
```

#### 开发模式运行

```bash
# 开发模式（自动重载）
npm run dev

# 构建项目
npm run build

# 生产模式运行
npm start
```

### 项目结构

```
superdesign-mcp-claude-code/
├── src/
│   └── index.ts                    # 主要服务器代码
├── dist/                           # 编译输出目录
│   ├── index.js                    # 编译后的主文件
│   └── index.d.ts                  # TypeScript 类型定义
├── superdesign/                    # 设计输出目录
│   ├── design_iterations/          # 设计文件
│   ├── design_system/              # 设计系统
│   └── gallery.html                # 画廊文件
├── package.json                    # 项目配置
├── tsconfig.json                   # TypeScript 配置
├── claude-mcp-config.json          # 本地MCP配置
└── README.md                       # 项目文档
```

### 核心代码架构

#### MCP 服务器初始化

```typescript
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const server = new Server({
  name: "superdesign-mcp-server",
  version: "1.0.0",
});
```

#### 工具定义和处理

```typescript
// 工具模式定义
const GenerateDesignSchema = z.object({
  prompt: z.string().describe("设计提示"),
  design_type: z.enum(["ui", "wireframe", "component", "logo", "icon"]),
  variations: z.number().min(1).max(5).default(3),
  framework: z.enum(["html", "react", "vue"]).default("html"),
});

// 工具处理器
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case "superdesign_generate":
      return await handleGenerateDesign(args);
    case "superdesign_iterate":
      return await handleIterateDesign(args);
    // ... 其他工具处理器
  }
});
```

### 测试

#### 单元测试

```bash
# 安装测试依赖
npm install --save-dev jest @types/jest ts-jest

# 运行测试
npm test

# 运行测试并生成覆盖率报告
npm run test:coverage
```

#### 集成测试

```bash
# 测试 MCP 服务器连接
node dist/index.js

# 测试工具调用
claude mcp list
```

#### 手动测试

```typescript
// 创建测试脚本 test/manual-test.ts
import { Server } from "@modelcontextprotocol/sdk/server/index.js";

async function testGenerateDesign() {
  const result = await server.callTool("superdesign_generate", {
    prompt: "测试仪表板设计",
    design_type: "ui",
    variations: 1,
  });
  console.log(result);
}

testGenerateDesign();
```

### 构建和部署

#### 构建配置

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "node",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

#### 构建脚本

```json
// package.json scripts
{
  "scripts": {
    "build": "tsc",
    "build:watch": "tsc --watch",
    "start": "node dist/index.js",
    "dev": "tsx src/index.ts",
    "clean": "rm -rf dist",
    "prebuild": "npm run clean"
  }
}
```

#### 发布准备

```bash
# 清理和构建
npm run clean
npm run build

# 验证构建
node dist/index.js

# 创建发布包
npm pack
```

### 贡献代码

#### 开发工作流

1. **Fork 仓库**

   ```bash
   # 在 GitHub 上 fork 仓库
   git clone https://github.com/your-username/superdesign-mcp-claude-code.git
   ```

2. **创建功能分支**

   ```bash
   git checkout -b feature/new-design-type
   ```

3. **开发和测试**

   ```bash
   # 进行开发
   npm run dev

   # 运行测试
   npm test

   # 构建验证
   npm run build
   ```

4. **提交代码**

   ```bash
   git add .
   git commit -m "feat: 添加新的设计类型支持"
   git push origin feature/new-design-type
   ```

5. **创建 Pull Request**
   - 在 GitHub 上创建 PR
   - 描述更改内容
   - 等待代码审查

#### 代码规范

**TypeScript 规范**：

```typescript
// 使用明确的类型定义
interface DesignConfig {
  type: "ui" | "wireframe" | "component" | "logo" | "icon";
  variations: number;
  framework?: "html" | "react" | "vue";
}

// 使用 async/await 而不是 Promise.then()
async function generateDesign(config: DesignConfig): Promise<string> {
  try {
    const result = await processDesign(config);
    return result;
  } catch (error) {
    console.error("设计生成失败:", error);
    throw error;
  }
}
```

**错误处理**：

```typescript
// 统一的错误处理
class SuperdesignError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = "SuperdesignError";
  }
}

// 在工具处理器中使用
try {
  const result = await generateDesign(args);
  return { content: [{ type: "text", text: result }] };
} catch (error) {
  if (error instanceof SuperdesignError) {
    return { content: [{ type: "text", text: `错误: ${error.message}` }] };
  }
  throw error;
}
```

#### 文档贡献

- 更新 README.md（英文版）
- 更新 README_CH.md（中文版）
- 添加代码注释
- 更新 API 文档
- 添加使用示例

#### 测试贡献

```typescript
// 添加单元测试
describe("superdesign_generate", () => {
  it("应该生成UI设计规范", async () => {
    const args = {
      prompt: "测试仪表板",
      design_type: "ui",
      variations: 1,
    };

    const result = await handleGenerateDesign(args);
    expect(result.content[0].text).toContain("设计规范");
  });
});
```

## ❓ 常见问题

### 安装相关问题

**Q: 支持哪些 Node.js 版本？**
A: 需要 Node.js 16.0.0 或更高版本。推荐使用 LTS 版本。

**Q: 可以在没有 Claude Code 的情况下使用吗？**
A: 不可以。这是专门为 Claude Code 设计的 MCP 服务器，需要 Claude Code 环境。

**Q: 支持其他 IDE 吗？**
A: 理论上支持任何兼容 MCP 的 IDE，但目前只在 Claude Code 中测试过。

### 配置相关问题

**Q: 用户级配置和项目级配置有什么区别？**
A:

- 用户级配置：全局生效，在任意目录都能使用
- 项目级配置：只在特定项目目录中生效
- 推荐使用用户级配置以获得最佳体验

**Q: 如何在多个项目中使用不同的配置？**
A: 可以在每个项目目录中创建项目级配置，或使用不同的服务器名称。

**Q: 配置文件在哪里？**
A:

- Windows: `C:\Users\用户名\.claude.json`
- macOS/Linux: `~/.claude.json`

### 使用相关问题

**Q: 生成的设计文件保存在哪里？**
A: 默认保存在当前工作目录的 `superdesign/design_iterations/` 文件夹中。

**Q: 可以自定义输出目录吗？**
A: 目前输出目录是固定的，但可以通过修改源代码来自定义。

**Q: 支持哪些设计格式？**
A: 支持 HTML、SVG、React JSX、Vue SFC 等格式。

**Q: 如何查看所有生成的设计？**
A: 使用 `superdesign_gallery` 工具生成交互式画廊，或使用 `superdesign_list` 列出所有文件。

### 故障排除问题

**Q: 为什么 MCP 工具没有出现在 Claude Code 中？**
A:

1. 确保完全退出并重启 Claude Code
2. 验证服务器配置：`claude mcp list`
3. 检查文件路径是否正确
4. 确保 Node.js 版本符合要求

**Q: 出现 "Permission denied" 错误怎么办？**
A:

```bash
# macOS/Linux
chmod +x dist/index.js

# Windows
# 以管理员身份运行 PowerShell
```

**Q: 构建失败怎么办？**
A:

```bash
# 清理并重新安装
rm -rf node_modules package-lock.json
npm install
npm run build
```

### 性能相关问题

**Q: 生成设计需要多长时间？**
A: 通常几秒钟内完成，具体取决于设计复杂度和系统性能。

**Q: 可以同时生成多个设计吗？**
A: 可以通过 `variations` 参数一次生成多个变体。

**Q: 有文件大小限制吗？**
A: 没有硬性限制，但建议单个设计文件不超过 10MB。

### 开发相关问题

**Q: 如何添加新的设计类型？**
A: 需要修改源代码中的 schema 定义和处理逻辑，然后重新构建。

**Q: 可以集成自定义设计模板吗？**
A: 可以通过修改 Superdesign 提示模板来实现。

**Q: 如何贡献代码？**
A: 请参考开发指南中的贡献流程，欢迎提交 Pull Request。

## 📄 许可证和贡献

### 许可证信息

本项目采用 **MIT 许可证**，与原始 [Superdesign](https://github.com/superdesigndev/superdesign) 项目保持一致。

#### MIT 许可证条款

```
MIT License

Copyright (c) 2024 Superdesign MCP Server Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

### 贡献指南

我们欢迎所有形式的贡献！无论是报告 bug、提出功能请求、改进文档还是提交代码。

#### 如何贡献

1. **报告问题**

   - 在 [GitHub Issues](https://github.com/jonthebeef/superdesign-mcp-claude-code/issues) 中报告 bug
   - 提供详细的重现步骤和环境信息
   - 使用适当的标签分类问题

2. **功能请求**

   - 在 Issues 中提出新功能建议
   - 详细描述功能需求和使用场景
   - 讨论实现方案的可行性

3. **文档改进**

   - 修正文档中的错误
   - 添加使用示例和教程
   - 翻译文档到其他语言

4. **代码贡献**
   - Fork 仓库并创建功能分支
   - 遵循代码规范和最佳实践
   - 添加适当的测试用例
   - 提交 Pull Request

#### 贡献者行为准则

- 尊重所有贡献者和用户
- 使用友善和包容的语言
- 接受建设性的批评和反馈
- 专注于对社区最有利的事情

#### 开发贡献流程

1. **准备开发环境**

   ```bash
   git clone https://github.com/your-username/superdesign-mcp-claude-code.git
   cd superdesign-mcp-claude-code
   npm install
   ```

2. **创建功能分支**

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **开发和测试**

   ```bash
   npm run dev        # 开发模式
   npm test          # 运行测试
   npm run build     # 构建项目
   ```

4. **提交代码**

   ```bash
   git add .
   git commit -m "feat: 添加新功能描述"
   git push origin feature/your-feature-name
   ```

5. **创建 Pull Request**
   - 提供清晰的 PR 标题和描述
   - 链接相关的 Issues
   - 等待代码审查和反馈

#### 代码提交规范

使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```
<类型>[可选的作用域]: <描述>

[可选的正文]

[可选的脚注]
```

**类型说明**：

- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 代码重构
- `test`: 测试相关
- `chore`: 构建过程或辅助工具的变动

**示例**：

```
feat(generator): 添加新的设计类型支持

- 添加 'infographic' 设计类型
- 更新相关的 schema 定义
- 添加对应的处理逻辑

Closes #123
```

### 致谢

#### 核心贡献者

- **原始 Superdesign 团队**: [@jasonzhou1993](https://twitter.com/jasonzhou1993) 和 [@jackjack_eth](https://twitter.com/jackjack_eth)
- **MCP 集成开发**: 本项目的维护者和贡献者

#### 特别感谢

- [Anthropic](https://www.anthropic.com/) - 提供 Claude 和 MCP 协议
- [Superdesign.dev](https://www.superdesign.dev) - 开源 AI 设计系统
- 所有测试用户和反馈提供者

#### 相关项目

- [Superdesign](https://github.com/superdesigndev/superdesign) - 原始开源 AI 设计代理
- [Model Context Protocol](https://modelcontextprotocol.io/) - MCP 协议规范
- [Claude Code](https://claude.ai/code) - Claude 的代码编辑器

### 社区和支持

#### 获取帮助

- **GitHub Issues**: 报告 bug 和功能请求
- **GitHub Discussions**: 社区讨论和问答
- **文档**: 查看本 README 和项目文档

#### 社区资源

- **示例项目**: 查看 `examples/` 目录中的使用示例
- **最佳实践**: 参考 `docs/` 目录中的指南
- **更新日志**: 查看 `CHANGELOG.md` 了解版本更新

#### 保持联系

- 关注项目更新和发布
- 参与社区讨论
- 分享您的使用经验和创作

---

## 🔗 相关链接

- **项目仓库**: [GitHub](https://github.com/jonthebeef/superdesign-mcp-claude-code)
- **原始 Superdesign**: [Superdesign.dev](https://www.superdesign.dev)
- **Claude Code**: [claude.ai/code](https://claude.ai/code)
- **MCP 协议**: [modelcontextprotocol.io](https://modelcontextprotocol.io/)
- **问题报告**: [GitHub Issues](https://github.com/jonthebeef/superdesign-mcp-claude-code/issues)

---

**感谢您使用 Superdesign MCP 服务器！** 🎨✨

如果您觉得这个项目有用，请考虑给我们一个 ⭐ Star，并分享给其他可能感兴趣的开发者和设计师。您的支持是我们持续改进的动力！
