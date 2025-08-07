#!/usr/bin/env node

/**
 * Test script for workspace_path parameter functionality
 * 测试workspace_path参数功能的脚本
 */

import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

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

function info(text) {
  console.log(`${colorize('ℹ️', 'blue')} ${text}`);
}

function step(text) {
  console.log(`${colorize('🔄', 'cyan')} ${text}`);
}

/**
 * 执行MCP服务器测试
 */
function testMcpServer(testData) {
  return new Promise((resolve) => {
    const { workspace_path, prompt, design_type, expected_path } = testData;
    
    step(`测试工作区路径: ${workspace_path}`);
    
    // 创建测试输入
    const input = JSON.stringify({
      method: "tools/call",
      params: {
        name: "superdesign_generate",
        arguments: {
          prompt,
          design_type,
          workspace_path,
          variations: 1
        }
      }
    });
    
    const child = spawn('node', ['dist/index.js'], {
      stdio: ['pipe', 'pipe', 'pipe'],
      cwd: process.cwd()
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
      // 检查是否创建了预期的目录结构
      const expectedDir = path.join(workspace_path, 'superdesign', 'design_iterations');
      
      if (fs.existsSync(expectedDir)) {
        success(`目录创建成功: ${expectedDir}`);
        
        // 检查是否有设计文件
        const files = fs.readdirSync(expectedDir);
        const designFiles = files.filter(f => f.includes(design_type));
        
        if (designFiles.length > 0) {
          success(`设计文件生成成功: ${designFiles[0]}`);
          resolve({ success: true, files: designFiles, directory: expectedDir });
        } else {
          error(`未找到设计文件在: ${expectedDir}`);
          resolve({ success: false, error: 'No design files found' });
        }
      } else {
        error(`目录未创建: ${expectedDir}`);
        resolve({ success: false, error: 'Directory not created' });
      }
    });
    
    // 发送输入
    child.stdin.write(input + '\n');
    child.stdin.end();
    
    // 设置超时
    setTimeout(() => {
      child.kill();
      resolve({ success: false, error: 'Timeout' });
    }, 10000);
  });
}

/**
 * 清理测试目录
 */
function cleanupTestDirectory(dirPath) {
  const superdesignDir = path.join(dirPath, 'superdesign');
  if (fs.existsSync(superdesignDir)) {
    fs.rmSync(superdesignDir, { recursive: true, force: true });
    info(`清理测试目录: ${superdesignDir}`);
  }
}

/**
 * 主测试函数
 */
async function runTests() {
  console.log(colorize('🧪 Workspace Path Parameter Test Suite', 'magenta'));
  console.log(colorize('🧪 工作区路径参数测试套件', 'magenta'));
  console.log('');
  
  const testCases = [
    {
      name: '场景1: Project1目录 - 电商网站UI',
      workspace_path: 'C:\\Users\\Administrator\\Documents\\Project1',
      prompt: 'ecommerce website homepage',
      design_type: 'ui',
      expected_path: 'C:\\Users\\Administrator\\Documents\\Project1\\superdesign\\design_iterations'
    },
    {
      name: '场景2: WebApp目录 - 移动端线框图',
      workspace_path: 'D:\\MyProjects\\WebApp',
      prompt: 'mobile social media app',
      design_type: 'wireframe',
      expected_path: 'D:\\MyProjects\\WebApp\\superdesign\\design_iterations'
    },
    {
      name: '场景3: TestDesigns目录 - React组件',
      workspace_path: 'C:\\Temp\\TestDesigns',
      prompt: 'React button component library',
      design_type: 'component',
      expected_path: 'C:\\Temp\\TestDesigns\\superdesign\\design_iterations'
    }
  ];
  
  let passedTests = 0;
  let totalTests = testCases.length;
  
  for (const testCase of testCases) {
    console.log(colorize(`\n📋 ${testCase.name}`, 'yellow'));
    console.log('='.repeat(60));
    
    // 清理之前的测试数据
    cleanupTestDirectory(testCase.workspace_path);
    
    try {
      const result = await testMcpServer(testCase);
      
      if (result.success) {
        success(`测试通过: ${testCase.name}`);
        success(`文件保存位置正确: ${result.directory}`);
        if (result.files && result.files.length > 0) {
          success(`生成的文件: ${result.files.join(', ')}`);
        }
        passedTests++;
      } else {
        error(`测试失败: ${testCase.name}`);
        error(`错误: ${result.error}`);
      }
    } catch (err) {
      error(`测试异常: ${testCase.name}`);
      error(`异常信息: ${err.message}`);
    }
  }
  
  // 显示测试总结
  console.log(colorize('\n📊 测试总结 / Test Summary', 'cyan'));
  console.log('='.repeat(60));
  
  if (passedTests === totalTests) {
    success(`所有测试通过！(${passedTests}/${totalTests})`);
    success('workspace_path 参数功能正常工作');
  } else {
    error(`部分测试失败 (${passedTests}/${totalTests})`);
    if (passedTests > 0) {
      info(`${passedTests} 个测试通过`);
    }
    if (totalTests - passedTests > 0) {
      error(`${totalTests - passedTests} 个测试失败`);
    }
  }
  
  console.log('');
  info('测试完成。请检查各个测试目录中的 superdesign/design_iterations/ 文件夹');
  info('以验证文件是否保存到了正确的位置。');
}

// 运行测试
if (process.argv[1] && process.argv[1].endsWith('test-workspace-path.js')) {
  runTests().catch(console.error);
}
