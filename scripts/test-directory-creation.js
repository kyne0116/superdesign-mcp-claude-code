#!/usr/bin/env node

/**
 * Simple test for directory creation with workspace_path
 * 简单的workspace_path目录创建测试
 */

import { config } from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load environment variables
config();

// Import our config functions
import { getSuperdeignDirectoryPath, getDesignIterationsPath } from '../dist/config.js';

// 颜色输出工具
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
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

/**
 * 测试目录创建逻辑
 */
function testDirectoryCreation(workspacePath, testName) {
  console.log(colorize(`\n📋 ${testName}`, 'yellow'));
  console.log('='.repeat(60));
  
  try {
    // 测试路径生成
    const superdesignDir = getSuperdeignDirectoryPath(workspacePath);
    const designIterationsDir = getDesignIterationsPath(workspacePath);
    
    info(`工作区路径: ${workspacePath}`);
    info(`Superdesign目录: ${superdesignDir}`);
    info(`设计迭代目录: ${designIterationsDir}`);
    
    // 创建目录
    if (!fs.existsSync(superdesignDir)) {
      fs.mkdirSync(superdesignDir, { recursive: true });
      success(`创建Superdesign目录: ${superdesignDir}`);
    } else {
      info(`Superdesign目录已存在: ${superdesignDir}`);
    }
    
    if (!fs.existsSync(designIterationsDir)) {
      fs.mkdirSync(designIterationsDir, { recursive: true });
      success(`创建设计迭代目录: ${designIterationsDir}`);
    } else {
      info(`设计迭代目录已存在: ${designIterationsDir}`);
    }
    
    // 验证目录存在
    if (fs.existsSync(superdesignDir) && fs.existsSync(designIterationsDir)) {
      success(`✅ 测试通过: ${testName}`);
      
      // 创建一个测试文件来验证
      const testFile = path.join(designIterationsDir, `test_${Date.now()}.html`);
      fs.writeFileSync(testFile, '<html><body>Test file</body></html>');
      success(`创建测试文件: ${testFile}`);
      
      return true;
    } else {
      error(`❌ 测试失败: ${testName} - 目录创建失败`);
      return false;
    }
    
  } catch (err) {
    error(`❌ 测试异常: ${testName} - ${err.message}`);
    return false;
  }
}

/**
 * 主测试函数
 */
function runTests() {
  console.log(colorize('🧪 Directory Creation Test Suite', 'cyan'));
  console.log(colorize('🧪 目录创建测试套件', 'cyan'));
  console.log('');
  
  const testCases = [
    {
      name: '场景1: Project1目录测试',
      workspacePath: 'C:\\Users\\Administrator\\Documents\\Project1'
    },
    {
      name: '场景2: WebApp目录测试',
      workspacePath: 'D:\\MyProjects\\WebApp'
    },
    {
      name: '场景3: TestDesigns目录测试',
      workspacePath: 'C:\\Temp\\TestDesigns'
    },
    {
      name: '场景4: 默认配置测试 (无workspace_path)',
      workspacePath: undefined  // 测试默认行为
    }
  ];
  
  let passedTests = 0;
  let totalTests = testCases.length;
  
  for (const testCase of testCases) {
    if (testDirectoryCreation(testCase.workspacePath, testCase.name)) {
      passedTests++;
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
  }
  
  console.log('');
  info('请检查各个测试目录中的 superdesign/design_iterations/ 文件夹');
  info('以验证目录结构是否正确创建。');
}

// 运行测试
if (process.argv[1] && process.argv[1].endsWith('test-directory-creation.js')) {
  runTests();
}
