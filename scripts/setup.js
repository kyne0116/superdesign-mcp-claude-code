#!/usr/bin/env node

/**
 * Superdesign MCP Setup Script
 * 自动化安装和配置脚本
 * Automated installation and configuration script
 */

import { config } from 'dotenv';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { spawn } from 'child_process';

// 颜色输出工具
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function colorize(text, color) {
  return `${colors[color]}${text}${colors.reset}`;
}

function success(text) {
  console.log(`${colorize('✅', 'green')} ${text}`);
}

function error(text) {
  console.log(`${colorize('❌', 'red')} ${text}`);
}

function warning(text) {
  console.log(`${colorize('⚠️', 'yellow')} ${text}`);
}

function info(text) {
  console.log(`${colorize('ℹ️', 'blue')} ${text}`);
}

function step(text) {
  console.log(`${colorize('🔄', 'cyan')} ${text}`);
}

/**
 * 执行命令
 */
function executeCommand(command, args = [], options = {}) {
  return new Promise((resolve) => {
    step(`执行命令: ${command} ${args.join(' ')}`);
    
    const child = spawn(command, args, { 
      stdio: options.silent ? ['pipe', 'pipe', 'pipe'] : ['inherit', 'inherit', 'inherit'],
      shell: true,
      cwd: options.cwd || process.cwd()
    });
    
    let stdout = '';
    let stderr = '';
    
    if (options.silent) {
      child.stdout.on('data', (data) => {
        stdout += data.toString();
      });
      
      child.stderr.on('data', (data) => {
        stderr += data.toString();
      });
    }
    
    child.on('close', (code) => {
      if (code === 0) {
        success(`命令执行成功: ${command}`);
      } else {
        error(`命令执行失败: ${command} (退出码: ${code})`);
      }
      resolve({ code, stdout, stderr });
    });
  });
}

/**
 * 检查并创建.env文件
 */
function setupEnvFile() {
  console.log(colorize('\n📝 设置环境变量文件 / Setting up environment file', 'cyan'));
  console.log('='.repeat(60));
  
  const envPath = path.join(process.cwd(), '.env');
  const envExamplePath = path.join(process.cwd(), '.env.example');
  
  if (!fs.existsSync(envPath)) {
    if (fs.existsSync(envExamplePath)) {
      step('从 .env.example 创建 .env 文件');
      
      // 读取模板文件
      let envContent = fs.readFileSync(envExamplePath, 'utf8');
      
      // 自动填充一些值
      const projectRoot = process.cwd();
      const mcpServerPath = path.join(projectRoot, 'dist', 'index.js');
      
      // 替换路径占位符
      envContent = envContent.replace(
        /WORKSPACE_PATH=.*$/m,
        `WORKSPACE_PATH=${projectRoot.replace(/\\/g, '/')}`
      );
      
      envContent = envContent.replace(
        /MCP_SERVER_PATH=.*$/m,
        `MCP_SERVER_PATH=${mcpServerPath.replace(/\\/g, '/')}`
      );
      
      // 写入.env文件
      fs.writeFileSync(envPath, envContent, 'utf8');
      success('.env 文件已创建并自动配置');
    } else {
      warning('.env.example 文件不存在，跳过 .env 文件创建');
    }
  } else {
    info('.env 文件已存在，跳过创建');
  }
  
  // 加载环境变量
  config();
}

/**
 * 安装依赖
 */
async function installDependencies() {
  console.log(colorize('\n📦 安装依赖 / Installing dependencies', 'cyan'));
  console.log('='.repeat(60));
  
  const result = await executeCommand('npm', ['install']);
  return result.code === 0;
}

/**
 * 构建项目
 */
async function buildProject() {
  console.log(colorize('\n🔨 构建项目 / Building project', 'cyan'));
  console.log('='.repeat(60));
  
  const result = await executeCommand('npm', ['run', 'build']);
  return result.code === 0;
}

/**
 * 生成MCP配置
 */
async function generateMcpConfig(scope = 'user') {
  console.log(colorize('\n⚙️ 生成MCP配置 / Generating MCP configuration', 'cyan'));
  console.log('='.repeat(60));
  
  const args = ['run', 'config:generate'];
  if (scope === 'project') {
    args.push(':project');
  }
  
  const result = await executeCommand('npm', args);
  return result.code === 0;
}

/**
 * 注册MCP服务器
 */
async function registerMcpServer() {
  console.log(colorize('\n🚀 注册MCP服务器 / Registering MCP server', 'cyan'));
  console.log('='.repeat(60));
  
  // 首先检查是否已经注册
  const listResult = await executeCommand('claude', ['mcp', 'list'], { silent: true });
  
  const serverName = process.env.MCP_SERVER_NAME || 'superdesign';
  const mcpServerPath = process.env.MCP_SERVER_PATH || path.join(process.cwd(), 'dist', 'index.js');
  const nodeExecutable = process.env.NODE_EXECUTABLE || 'node';
  
  if (listResult.code === 0 && listResult.stdout.includes(serverName)) {
    info(`MCP服务器 "${serverName}" 已经注册`);
    
    // 检查是否连接
    if (listResult.stdout.includes('✓ Connected')) {
      success(`MCP服务器 "${serverName}" 已连接`);
      return true;
    } else {
      warning(`MCP服务器 "${serverName}" 已注册但未连接，尝试重新注册`);
      
      // 移除现有注册
      await executeCommand('claude', ['mcp', 'remove', serverName], { silent: true });
    }
  }
  
  // 注册新的MCP服务器
  const registerResult = await executeCommand('claude', [
    'mcp', 'add', '--scope', 'user', serverName, nodeExecutable, mcpServerPath
  ]);
  
  if (registerResult.code === 0) {
    success(`MCP服务器 "${serverName}" 注册成功`);
    
    // 验证注册
    const verifyResult = await executeCommand('claude', ['mcp', 'list'], { silent: true });
    if (verifyResult.code === 0 && verifyResult.stdout.includes(serverName)) {
      if (verifyResult.stdout.includes('✓ Connected')) {
        success('MCP服务器连接验证成功');
        return true;
      } else {
        warning('MCP服务器已注册但连接状态未知');
        return true;
      }
    }
  }
  
  error('MCP服务器注册失败');
  return false;
}

/**
 * 运行最终验证
 */
async function runFinalVerification() {
  console.log(colorize('\n🔍 最终验证 / Final verification', 'cyan'));
  console.log('='.repeat(60));
  
  const result = await executeCommand('npm', ['run', 'config:doctor'], { silent: true });
  
  if (result.code === 0) {
    success('所有验证检查通过');
    return true;
  } else {
    error('验证检查发现问题');
    console.log('\n详细诊断信息:');
    console.log(result.stdout);
    return false;
  }
}

/**
 * 显示完成信息
 */
function showCompletionInfo() {
  console.log(colorize('\n🎉 安装完成！/ Installation completed!', 'magenta'));
  console.log('='.repeat(60));
  
  console.log('✨ Superdesign MCP服务器已成功安装和配置！');
  console.log('');
  console.log('📋 下一步操作:');
  console.log('1. 重启 Claude Code');
  console.log('2. 在 Claude Code 中询问: "你有哪些可用的工具？"');
  console.log('3. 确认可以看到 Superdesign 相关工具');
  console.log('');
  console.log('🔧 有用的命令:');
  console.log('- npm run config:doctor  # 诊断配置问题');
  console.log('- npm run config:show    # 显示当前配置');
  console.log('- claude mcp list        # 查看MCP服务器状态');
  console.log('');
  console.log('📚 更多信息请查看 README_CH.md 文档');
}

/**
 * 显示错误信息和修复建议
 */
function showErrorInfo() {
  console.log(colorize('\n❌ 安装过程中遇到问题 / Issues encountered during installation', 'red'));
  console.log('='.repeat(60));
  
  console.log('🔧 请尝试以下修复步骤:');
  console.log('');
  console.log('1. 检查 Node.js 和 npm 是否正确安装:');
  console.log('   node --version');
  console.log('   npm --version');
  console.log('');
  console.log('2. 检查 Claude Code CLI 是否可用:');
  console.log('   claude --version');
  console.log('');
  console.log('3. 手动运行诊断:');
  console.log('   npm run config:doctor');
  console.log('');
  console.log('4. 查看详细文档:');
  console.log('   README_CH.md 中的故障排除章节');
}

/**
 * 主函数
 */
async function main() {
  console.log(colorize('🎨 Superdesign MCP 自动安装脚本', 'magenta'));
  console.log(colorize('🎨 Superdesign MCP Automated Setup Script', 'magenta'));
  console.log('');
  
  const args = process.argv.slice(2);
  const scope = args.includes('--project') ? 'project' : 'user';
  const skipDeps = args.includes('--skip-deps');
  
  info(`配置作用域: ${scope}`);
  if (skipDeps) info('跳过依赖安装');
  console.log('');
  
  let success_count = 0;
  let total_steps = skipDeps ? 4 : 5;
  
  try {
    // 步骤1: 设置环境文件
    setupEnvFile();
    success_count++;
    
    // 步骤2: 安装依赖 (可选)
    if (!skipDeps) {
      if (await installDependencies()) {
        success_count++;
      } else {
        throw new Error('依赖安装失败');
      }
    }
    
    // 步骤3: 构建项目
    if (await buildProject()) {
      success_count++;
    } else {
      throw new Error('项目构建失败');
    }
    
    // 步骤4: 生成MCP配置
    if (await generateMcpConfig(scope)) {
      success_count++;
    } else {
      throw new Error('MCP配置生成失败');
    }
    
    // 步骤5: 注册MCP服务器
    if (await registerMcpServer()) {
      success_count++;
    } else {
      throw new Error('MCP服务器注册失败');
    }
    
    // 最终验证
    await runFinalVerification();
    
    // 显示完成信息
    showCompletionInfo();
    
  } catch (error) {
    error(`安装失败: ${error.message}`);
    console.log(`\n完成步骤: ${success_count}/${total_steps}`);
    showErrorInfo();
    process.exit(1);
  }
}

// 检查是否直接运行此脚本
const isMainModule = process.argv[1] && process.argv[1].endsWith('setup.js');
if (isMainModule) {
  main().catch(console.error);
}
