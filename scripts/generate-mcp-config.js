#!/usr/bin/env node

/**
 * Superdesign MCP Configuration Generator
 * 生成适用于不同平台的MCP配置文件
 * Generates MCP configuration files for different platforms
 */

import { config } from 'dotenv';
import fs from 'fs';
import os from 'os';
import path from 'path';

// Load environment variables
config();

/**
 * 获取环境变量值，支持默认值
 */
function getEnvValue(key, defaultValue = '') {
  return process.env[key] || defaultValue;
}

/**
 * 检测当前平台
 */
function detectPlatform() {
  const forcePlatform = getEnvValue('FORCE_PLATFORM');
  if (forcePlatform) {
    return forcePlatform;
  }
  return os.platform();
}

/**
 * 规范化路径
 */
function normalizePath(inputPath) {
  if (!inputPath) return '';
  
  if (!path.isAbsolute(inputPath)) {
    return path.resolve(process.cwd(), inputPath);
  }
  
  return path.normalize(inputPath);
}

/**
 * 获取MCP服务器路径
 */
function getMcpServerPath() {
  const envPath = getEnvValue('MCP_SERVER_PATH');
  if (envPath) {
    return normalizePath(envPath);
  }
  
  // 尝试自动检测
  const projectRoot = process.cwd();
  const distPath = path.join(projectRoot, 'dist', 'index.js');
  
  if (fs.existsSync(distPath)) {
    return distPath;
  }
  
  return path.join(projectRoot, 'dist', 'index.js');
}

/**
 * 生成MCP配置对象
 */
function generateMcpConfig() {
  const serverName = getEnvValue('MCP_SERVER_NAME', 'superdesign');
  const nodeExecutable = getEnvValue('NODE_EXECUTABLE', 'node');
  const mcpServerPath = getMcpServerPath();
  
  return {
    mcpServers: {
      [serverName]: {
        command: nodeExecutable,
        args: [mcpServerPath],
        env: {}
      }
    }
  };
}

/**
 * 生成用户级MCP配置路径
 */
function getUserMcpConfigPath() {
  const platform = detectPlatform();
  const homeDir = os.homedir();
  
  switch (platform) {
    case 'win32':
      return path.join(homeDir, '.claude.json');
    case 'darwin':
    case 'linux':
    default:
      return path.join(homeDir, '.claude.json');
  }
}

/**
 * 生成项目级MCP配置路径
 */
function getProjectMcpConfigPath() {
  return path.join(process.cwd(), 'claude-mcp-config.json');
}

/**
 * 保存配置文件
 */
function saveConfig(configPath, config) {
  const configDir = path.dirname(configPath);
  
  // 确保目录存在
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }
  
  // 如果文件已存在，备份
  if (fs.existsSync(configPath)) {
    const backupPath = `${configPath}.backup.${Date.now()}`;
    fs.copyFileSync(configPath, backupPath);
    console.log(`📦 已备份现有配置文件到: ${backupPath}`);
    console.log(`📦 Backed up existing config to: ${backupPath}`);
  }
  
  // 写入新配置
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8');
  console.log(`✅ 配置文件已保存到: ${configPath}`);
  console.log(`✅ Configuration saved to: ${configPath}`);
}

/**
 * 显示配置信息
 */
function displayConfig(config) {
  console.log('\n📋 生成的MCP配置 / Generated MCP Configuration:');
  console.log('=' .repeat(60));
  console.log(JSON.stringify(config, null, 2));
  console.log('=' .repeat(60));
}

/**
 * 显示使用说明
 */
function displayUsage() {
  const platform = detectPlatform();
  const serverName = getEnvValue('MCP_SERVER_NAME', 'superdesign');
  
  console.log('\n🚀 使用说明 / Usage Instructions:');
  console.log('=' .repeat(60));
  
  if (platform === 'win32') {
    console.log('Windows 平台 / Windows Platform:');
    console.log('');
    console.log('1. 验证MCP服务器注册 / Verify MCP server registration:');
    console.log('   claude mcp list');
    console.log('');
    console.log('2. 如果需要手动添加 / If manual addition is needed:');
    console.log(`   claude mcp add --scope user ${serverName} node "${getMcpServerPath()}"`);
    console.log('');
    console.log('3. 重启Claude Code并测试 / Restart Claude Code and test');
  } else {
    console.log('macOS/Linux 平台 / macOS/Linux Platform:');
    console.log('');
    console.log('1. 验证MCP服务器注册 / Verify MCP server registration:');
    console.log('   claude mcp list');
    console.log('');
    console.log('2. 如果需要手动添加 / If manual addition is needed:');
    console.log(`   claude mcp add --scope user ${serverName} node "${getMcpServerPath()}"`);
    console.log('');
    console.log('3. 重启Claude Code并测试 / Restart Claude Code and test');
  }
  
  console.log('=' .repeat(60));
}

/**
 * 主函数
 */
function main() {
  console.log('🎨 Superdesign MCP Configuration Generator');
  console.log('🎨 Superdesign MCP 配置生成器');
  console.log('');
  
  const args = process.argv.slice(2);
  const scope = args.includes('--project') ? 'project' : 'user';
  const showOnly = args.includes('--show-only');
  
  console.log(`📍 平台 / Platform: ${detectPlatform()}`);
  console.log(`📍 配置作用域 / Configuration Scope: ${scope}`);
  console.log(`📍 MCP服务器路径 / MCP Server Path: ${getMcpServerPath()}`);
  
  // 生成配置
  const config = generateMcpConfig();
  
  // 显示配置
  displayConfig(config);
  
  if (!showOnly) {
    // 保存配置
    const configPath = scope === 'project' 
      ? getProjectMcpConfigPath() 
      : getUserMcpConfigPath();
    
    saveConfig(configPath, config);
  }
  
  // 显示使用说明
  displayUsage();
  
  console.log('\n✨ 配置生成完成！/ Configuration generation completed!');
}

// 运行主函数
// Check if this script is being run directly
const isMainModule = process.argv[1] && process.argv[1].endsWith('generate-mcp-config.js');
if (isMainModule) {
  main();
}
