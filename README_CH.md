# Superdesign MCP 服务器

🎨 **在 Claude Code 中直接使用 AI 设计工具** - 无需 API 密钥，一键安装，5分钟即可开始创建专业设计！

基于开源 [Superdesign](https://github.com/superdesigndev/superdesign) 项目，通过 MCP 协议将强大的 AI 设计功能原生集成到您的 IDE 中。

## ✨ 核心特性

| 特性 | 说明 |
|------|------|
| 🚀 **一键安装** | `npm run setup` 自动完成所有配置 |
| 🔑 **无需 API 密钥** | 直接使用 Claude Code 内置连接 |
| 🎨 **多种设计类型** | UI界面、线框图、组件、Logo、图标 |
| 🔄 **智能迭代** | 基于反馈持续优化设计 |
| 📱 **响应式设计** | 自动适配移动端、平板、桌面 |
| 🖼️ **可视化画廊** | 内置HTML画廊查看所有设计 |

## 🚀 快速开始

### 📋 系统要求

- **Node.js** 16+ 和 **npm** 7+
- **Claude Code** 最新版本
- **操作系统**: Windows 10+, macOS 10.15+, Linux (Ubuntu 18.04+)

### ⚡ 一键安装（推荐）

```bash
# 1. 克隆项目
git clone https://github.com/kyne0116/superdesign-mcp-claude-code.git
cd superdesign-mcp-claude-code

# 2. 一键安装和配置
npm run setup

# 3. 重启 Claude Code
# 完成！现在可以在 Claude Code 中使用 AI 设计工具了
```

### ✅ 验证安装

在 Claude Code 中输入：
```
你有哪些设计工具可用？
```

如果看到 Superdesign 相关工具，说明安装成功！

## 📖 使用教程

### 🎯 基本使用

安装完成后，在 Claude Code 中使用自然语言即可开始设计：

```
请帮我设计一个电商网站的首页
```

```
创建一个移动端社交媒体应用的线框图
```

```
设计一个现代风格的按钮组件库
```

### 🛠️ 可用工具

| 工具 | 用途 | 示例 |
|------|------|------|
| **设计生成** | 创建新设计 | "设计一个登录页面" |
| **设计迭代** | 改进现有设计 | "让这个按钮更现代一些" |
| **设计画廊** | 查看所有设计 | "显示我的设计画廊" |
| **设计列表** | 列出所有设计文件 | "列出我的所有设计" |

### 🎨 设计类型

- **UI 界面**: 完整的用户界面设计
- **线框图**: 黑白简约的布局结构
- **组件**: 可复用的 UI 组件
- **Logo**: 品牌标识设计
- **图标**: SVG 图标设计

### 🔧 高级配置

#### 自定义工作目录

可以为不同项目指定不同的设计保存位置：

```bash
# 在项目目录中使用
cd /path/to/your/project
# 然后在 Claude Code 中指定 workspace_path 参数
```

#### 诊断和维护

```bash
# 检查配置状态
npm run config:doctor

# 重新安装（如遇问题）
npm run setup:quick

# 查看当前配置
npm run config:show
```

## 🔧 故障排除

### 常见问题

#### ❓ 安装失败

**问题**: `npm run setup` 执行失败
```bash
# 解决方案
npm run config:doctor  # 诊断问题
npm run setup:quick    # 重新安装
```

**问题**: Claude Code 中看不到 Superdesign 工具
```bash
# 解决方案
claude mcp list        # 检查服务器状态
claude mcp remove superdesign  # 移除旧配置
npm run setup:quick    # 重新安装
```

#### ❓ 使用问题

**问题**: 设计文件保存位置不正确
- 确保在正确的项目目录中使用
- 可以通过 workspace_path 参数指定保存位置

**问题**: 生成的设计不符合预期
- 尝试更详细的描述
- 使用设计迭代功能改进现有设计

### 手动安装（备选方案）

如果自动安装遇到问题，可以手动安装：

```bash
# 1. 确保 Node.js 16+ 已安装
node --version

# 2. 克隆项目
git clone https://github.com/kyne0116/superdesign-mcp-claude-code.git
cd superdesign-mcp-claude-code

# 3. 安装和构建
npm install
npm run build

# 4. 手动注册 MCP 服务器
claude mcp add --scope user superdesign node "$(pwd)/dist/index.js"

# 5. 验证
claude mcp list
```

## 💡 常见问题

### 安装相关

**Q: 支持哪些 Node.js 版本？**
A: 需要 Node.js 16.0.0 或更高版本，推荐使用 LTS 版本。

**Q: 支持哪些操作系统？**
A: Windows 10+, macOS 10.15+, Linux (Ubuntu 18.04+)

**Q: 是否需要 Anthropic API 密钥？**
A: 不需要，直接使用 Claude Code 的内置连接。

### 使用相关

**Q: 如何指定设计文件保存位置？**
A: 可以通过 workspace_path 参数指定，或在项目目录中使用。

**Q: 如何查看生成的设计？**
A: 使用"显示我的设计画廊"命令，会自动打开HTML画廊。

**Q: 设计质量不满意怎么办？**
A: 使用设计迭代功能，提供具体反馈来改进设计。

## ⚙️ 高级配置

### 环境变量配置

如需自定义配置，可以修改 `.env` 文件：

```bash
# 主要配置选项
WORKSPACE_PATH=/path/to/your/designs    # 设计文件保存位置
DEFAULT_VARIATIONS=3                    # 默认生成变体数量
LIVE_GALLERY_PORT=3000                 # 画廊服务器端口
DEBUG=false                            # 调试模式
```

### 配置管理命令

```bash
npm run config:show     # 显示当前配置
npm run config:doctor   # 诊断配置问题
npm run setup:quick     # 重新安装配置
```

## 🔗 相关链接

- **项目仓库**: [GitHub](https://github.com/kyne0116/superdesign-mcp-claude-code)
- **原始 Superdesign**: [Superdesign.dev](https://www.superdesign.dev)
- **Claude Code**: [claude.ai/code](https://claude.ai/code)
- **MCP 协议**: [modelcontextprotocol.io](https://modelcontextprotocol.io/)

## 📄 许可证

本项目采用 **MIT 许可证**，与原始 [Superdesign](https://github.com/superdesigndev/superdesign) 项目保持一致。

---

**🎨 开始您的 AI 设计之旅吧！**

如有问题，请在 [GitHub](https://github.com/kyne0116/superdesign-mcp-claude-code) 提交 Issue。
