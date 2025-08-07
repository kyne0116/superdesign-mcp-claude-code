#!/usr/bin/env node

/**
 * Superdesign MCP Configuration Doctor
 * 诊断和验证MCP配置的健康状态
 * Diagnose and validate MCP configuration health
 */

import { config } from 'dotenv';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { spawn } from 'child_process';

// Load environment variables
config();

/**
 * 颜色输出工具
 */
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
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

/**
 * 获取环境变量值
 */
function getEnvValue(key, defaultValue = '') {
  return process.env[key] || defaultValue;
}

/**
 * 检查文件是否存在
 */
function checkFileExists(filePath, description) {
  if (fs.existsSync(filePath)) {
    success(`${description}: ${filePath}`);
    return true;
  } else {
    error(`${description} 不存在: ${filePath}`);
    return false;
  }
}

/**
 * 检查目录是否存在
 */
function checkDirectoryExists(dirPath, description) {
  if (fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory()) {
    success(`${description}: ${dirPath}`);
    return true;
  } else {
    error(`${description} 不存在: ${dirPath}`);
    return false;
  }
}

/**
 * 执行命令并返回结果
 */
function executeCommand(command, args = []) {
  return new Promise((resolve) => {
    const child = spawn(command, args, { 
      stdio: ['pipe', 'pipe', 'pipe'],
      shell: true 
    });
    
    let stdout = '';
    let stderr = '';
    
    child.stdout.on('data', (data) => {
      stdout += data.toString();
    });
    
    child.stderr.on('data', (data) => {
      stderr += data.toString();
    });
    
    child.on('close', (code) => {
      resolve({ code, stdout, stderr });
    });
    
    // 设置超时
    setTimeout(() => {
      child.kill();
      resolve({ code: -1, stdout, stderr: 'Command timeout' });
    }, 10000);
  });
}

/**
 * 检查Node.js环境
 */
async function checkNodeEnvironment() {
  console.log(colorize('\n🔍 检查Node.js环境 / Checking Node.js Environment', 'cyan'));
  console.log('='.repeat(60));
  
  // 检查Node.js版本
  const nodeResult = await executeCommand('node', ['--version']);
  if (nodeResult.code === 0) {
    const version = nodeResult.stdout.trim();
    success(`Node.js 版本: ${version}`);
    
    // 检查版本是否满足要求
    const versionNumber = parseInt(version.replace('v', '').split('.')[0]);
    if (versionNumber >= 16) {
      success('Node.js 版本满足要求 (>= 16)');
    } else {
      error('Node.js 版本过低，需要 >= 16');
    }
  } else {
    error('Node.js 未安装或不在PATH中');
  }
  
  // 检查npm版本
  const npmResult = await executeCommand('npm', ['--version']);
  if (npmResult.code === 0) {
    success(`npm 版本: ${npmResult.stdout.trim()}`);
  } else {
    error('npm 未安装或不在PATH中');
  }
}

/**
 * 检查项目文件
 */
function checkProjectFiles() {
  console.log(colorize('\n📁 检查项目文件 / Checking Project Files', 'cyan'));
  console.log('='.repeat(60));
  
  const projectRoot = process.cwd();
  info(`项目根目录: ${projectRoot}`);
  
  // 检查关键文件
  const files = [
    { path: 'package.json', desc: 'Package配置文件' },
    { path: 'tsconfig.json', desc: 'TypeScript配置文件' },
    { path: 'src/index.ts', desc: '主源码文件' },
    { path: 'src/config.ts', desc: '配置模块文件' },
    { path: 'dist/index.js', desc: '编译后的主文件' },
    { path: '.env.example', desc: '环境变量模板文件' }
  ];
  
  let allFilesExist = true;
  files.forEach(file => {
    const fullPath = path.join(projectRoot, file.path);
    if (!checkFileExists(fullPath, file.desc)) {
      allFilesExist = false;
    }
  });
  
  return allFilesExist;
}

/**
 * 检查环境变量配置
 */
function checkEnvironmentConfig() {
  console.log(colorize('\n⚙️ 检查环境变量配置 / Checking Environment Configuration', 'cyan'));
  console.log('='.repeat(60));
  
  // 检查.env文件
  const envPath = path.join(process.cwd(), '.env');
  const hasEnvFile = checkFileExists(envPath, '.env 配置文件');
  
  // 检查关键环境变量
  const envVars = [
    { key: 'MCP_SERVER_NAME', desc: 'MCP服务器名称', required: false },
    { key: 'WORKSPACE_PATH', desc: '工作目录路径', required: false },
    { key: 'MCP_SERVER_PATH', desc: 'MCP服务器路径', required: false },
    { key: 'NODE_EXECUTABLE', desc: 'Node.js可执行文件路径', required: false }
  ];
  
  envVars.forEach(envVar => {
    const value = getEnvValue(envVar.key);
    if (value) {
      success(`${envVar.desc}: ${value}`);
    } else if (envVar.required) {
      error(`缺少必需的环境变量: ${envVar.key}`);
    } else {
      info(`环境变量未设置 (将使用默认值): ${envVar.key}`);
    }
  });
  
  return hasEnvFile;
}

/**
 * 检查MCP服务器路径
 */
function checkMcpServerPath() {
  console.log(colorize('\n🚀 检查MCP服务器路径 / Checking MCP Server Path', 'cyan'));
  console.log('='.repeat(60));
  
  const mcpServerPath = getEnvValue('MCP_SERVER_PATH') || path.join(process.cwd(), 'dist', 'index.js');
  
  if (checkFileExists(mcpServerPath, 'MCP服务器文件')) {
    // 检查文件是否可执行
    try {
      fs.accessSync(mcpServerPath, fs.constants.R_OK);
      success('MCP服务器文件可读');
      return true;
    } catch (error) {
      error('MCP服务器文件不可读');
      return false;
    }
  }
  
  return false;
}

/**
 * 检查Claude MCP配置
 */
async function checkClaudeMcpConfig() {
  console.log(colorize('\n🎯 检查Claude MCP配置 / Checking Claude MCP Configuration', 'cyan'));
  console.log('='.repeat(60));
  
  // 检查claude命令是否可用
  const claudeResult = await executeCommand('claude', ['--version']);
  if (claudeResult.code !== 0) {
    error('Claude Code CLI 未安装或不在PATH中');
    warning('请安装Claude Code并确保claude命令可用');
    return false;
  }
  
  success(`Claude Code CLI 可用`);
  
  // 检查MCP服务器列表
  const mcpListResult = await executeCommand('claude', ['mcp', 'list']);
  if (mcpListResult.code === 0) {
    const output = mcpListResult.stdout;
    const serverName = getEnvValue('MCP_SERVER_NAME', 'superdesign');
    
    if (output.includes(serverName)) {
      if (output.includes('✓ Connected')) {
        success(`MCP服务器 "${serverName}" 已注册并连接`);
        return true;
      } else {
        warning(`MCP服务器 "${serverName}" 已注册但未连接`);
        return false;
      }
    } else {
      error(`MCP服务器 "${serverName}" 未注册`);
      return false;
    }
  } else {
    error('无法获取MCP服务器列表');
    return false;
  }
}

/**
 * 提供修复建议
 */
function provideSuggestions() {
  console.log(colorize('\n💡 修复建议 / Repair Suggestions', 'cyan'));
  console.log('='.repeat(60));
  
  console.log('如果遇到问题，请尝试以下步骤：');
  console.log('');
  console.log('1. 重新构建项目:');
  console.log('   npm run build');
  console.log('');
  console.log('2. 生成配置文件:');
  console.log('   npm run config:generate');
  console.log('');
  console.log('3. 重新设置MCP服务器:');
  console.log('   claude mcp remove superdesign');
  console.log('   npm run setup');
  console.log('');
  console.log('4. 检查环境变量:');
  console.log('   cp .env.example .env');
  console.log('   # 编辑 .env 文件设置正确的路径');
  console.log('');
  console.log('5. 重启Claude Code并重新测试');
}

/**
 * 主函数
 */
async function main() {
  console.log(colorize('🏥 Superdesign MCP Configuration Doctor', 'magenta'));
  console.log(colorize('🏥 Superdesign MCP 配置诊断工具', 'magenta'));
  console.log('');
  
  let allChecksPass = true;
  
  // 执行各项检查
  await checkNodeEnvironment();
  
  if (!checkProjectFiles()) allChecksPass = false;
  if (!checkEnvironmentConfig()) allChecksPass = false;
  if (!checkMcpServerPath()) allChecksPass = false;
  if (!await checkClaudeMcpConfig()) allChecksPass = false;
  
  // 显示总结
  console.log(colorize('\n📊 诊断总结 / Diagnosis Summary', 'cyan'));
  console.log('='.repeat(60));
  
  if (allChecksPass) {
    success('所有检查通过！配置看起来正常。');
    success('All checks passed! Configuration looks healthy.');
  } else {
    error('发现一些问题，请查看上面的详细信息。');
    error('Some issues found, please check the details above.');
    provideSuggestions();
  }
  
  console.log('');
}

// 检查是否直接运行此脚本
const isMainModule = process.argv[1] && process.argv[1].endsWith('config-doctor.js');
if (isMainModule) {
  main().catch(console.error);
}
