import { config } from 'dotenv';
import * as path from 'path';
import * as os from 'os';
import { existsSync } from 'fs';

// Load environment variables from .env file
config();

/**
 * 平台类型枚举
 * Platform type enumeration
 */
export enum Platform {
  WINDOWS = 'win32',
  MACOS = 'darwin',
  LINUX = 'linux'
}

/**
 * 日志级别枚举
 * Log level enumeration
 */
export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug'
}

/**
 * 配置接口定义
 * Configuration interface definition
 */
export interface SuperdesignConfig {
  // 基本配置 / Basic Configuration
  serverName: string;
  serverVersion: string;
  
  // 路径配置 / Path Configuration
  workspacePath: string;
  superdesignDirName: string;
  designIterationsDir: string;
  designSystemDir: string;
  
  // MCP配置 / MCP Configuration
  mcpServerPath: string;
  nodeExecutable: string;
  
  // 服务器配置 / Server Configuration
  liveGalleryPort: number;
  httpTimeout: number;
  
  // 文件管理配置 / File Management Configuration
  defaultVariations: number;
  maxVariations: number;
  defaultCleanupDays: number;
  defaultCleanupCount: number;
  maxFileSize: number;
  
  // 调试和日志配置 / Debug and Logging Configuration
  debug: boolean;
  logLevel: LogLevel;
  enablePerformanceMonitoring: boolean;
  
  // 平台特定配置 / Platform Specific Configuration
  platform: Platform;
  windowsLongPathSupport: boolean;
  filePermissions: number;
  dirPermissions: number;
  
  // 高级配置 / Advanced Configuration
  envPrefix: string;
  enableConfigWatching: boolean;
  tempDir: string;
  enableAutoBackup: boolean;
  backupRetentionCount: number;
}

/**
 * 获取环境变量值，支持默认值
 * Get environment variable value with default fallback
 */
function getEnvValue(key: string, defaultValue: string = ''): string {
  return process.env[key] || defaultValue;
}

/**
 * 获取环境变量布尔值
 * Get environment variable as boolean
 */
function getEnvBoolean(key: string, defaultValue: boolean = false): boolean {
  const value = process.env[key];
  if (!value) return defaultValue;
  return value.toLowerCase() === 'true' || value === '1';
}

/**
 * 获取环境变量数字值
 * Get environment variable as number
 */
function getEnvNumber(key: string, defaultValue: number): number {
  const value = process.env[key];
  if (!value) return defaultValue;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
}

/**
 * 检测当前平台
 * Detect current platform
 */
function detectPlatform(): Platform {
  const forcePlatform = getEnvValue('FORCE_PLATFORM');
  if (forcePlatform && Object.values(Platform).includes(forcePlatform as Platform)) {
    return forcePlatform as Platform;
  }
  
  switch (os.platform()) {
    case 'win32':
      return Platform.WINDOWS;
    case 'darwin':
      return Platform.MACOS;
    case 'linux':
      return Platform.LINUX;
    default:
      return Platform.LINUX; // 默认为Linux / Default to Linux
  }
}

/**
 * 规范化路径，处理跨平台兼容性
 * Normalize path for cross-platform compatibility
 */
function normalizePath(inputPath: string): string {
  if (!inputPath) return '';
  
  // 处理相对路径 / Handle relative paths
  if (!path.isAbsolute(inputPath)) {
    return path.resolve(process.cwd(), inputPath);
  }
  
  // 规范化路径分隔符 / Normalize path separators
  return path.normalize(inputPath);
}

/**
 * 获取默认工作目录
 * Get default workspace directory
 */
function getDefaultWorkspacePath(): string {
  const envPath = getEnvValue('WORKSPACE_PATH');
  if (envPath) {
    return normalizePath(envPath);
  }
  return process.cwd();
}

/**
 * 获取默认MCP服务器路径
 * Get default MCP server path
 */
function getDefaultMcpServerPath(): string {
  const envPath = getEnvValue('MCP_SERVER_PATH');
  if (envPath) {
    return normalizePath(envPath);
  }
  
  // 尝试自动检测项目根目录下的dist/index.js
  // Try to auto-detect dist/index.js in project root
  const projectRoot = process.cwd();
  const distPath = path.join(projectRoot, 'dist', 'index.js');
  
  if (existsSync(distPath)) {
    return distPath;
  }
  
  // 返回相对路径作为后备
  // Return relative path as fallback
  return './dist/index.js';
}

/**
 * 获取默认临时目录
 * Get default temporary directory
 */
function getDefaultTempDir(): string {
  const envTempDir = getEnvValue('TEMP_DIR');
  if (envTempDir) {
    return normalizePath(envTempDir);
  }
  return os.tmpdir();
}

/**
 * 创建配置对象
 * Create configuration object
 */
function createConfig(): SuperdesignConfig {
  const platform = detectPlatform();
  
  return {
    // 基本配置 / Basic Configuration
    serverName: getEnvValue('MCP_SERVER_NAME', 'superdesign'),
    serverVersion: getEnvValue('MCP_SERVER_VERSION', '1.0.0'),
    
    // 路径配置 / Path Configuration
    workspacePath: getDefaultWorkspacePath(),
    superdesignDirName: getEnvValue('SUPERDESIGN_DIR_NAME', 'superdesign'),
    designIterationsDir: getEnvValue('DESIGN_ITERATIONS_DIR', 'design_iterations'),
    designSystemDir: getEnvValue('DESIGN_SYSTEM_DIR', 'design_system'),
    
    // MCP配置 / MCP Configuration
    mcpServerPath: getDefaultMcpServerPath(),
    nodeExecutable: getEnvValue('NODE_EXECUTABLE', 'node'),
    
    // 服务器配置 / Server Configuration
    liveGalleryPort: getEnvNumber('LIVE_GALLERY_PORT', 3000),
    httpTimeout: getEnvNumber('HTTP_TIMEOUT', 30000),
    
    // 文件管理配置 / File Management Configuration
    defaultVariations: getEnvNumber('DEFAULT_VARIATIONS', 3),
    maxVariations: getEnvNumber('MAX_VARIATIONS', 5),
    defaultCleanupDays: getEnvNumber('DEFAULT_CLEANUP_DAYS', 30),
    defaultCleanupCount: getEnvNumber('DEFAULT_CLEANUP_COUNT', 50),
    maxFileSize: getEnvNumber('MAX_FILE_SIZE', 10485760), // 10MB
    
    // 调试和日志配置 / Debug and Logging Configuration
    debug: getEnvBoolean('DEBUG', false),
    logLevel: (getEnvValue('LOG_LEVEL', 'info') as LogLevel) || LogLevel.INFO,
    enablePerformanceMonitoring: getEnvBoolean('ENABLE_PERFORMANCE_MONITORING', false),
    
    // 平台特定配置 / Platform Specific Configuration
    platform,
    windowsLongPathSupport: getEnvBoolean('WINDOWS_LONG_PATH_SUPPORT', true),
    filePermissions: getEnvNumber('FILE_PERMISSIONS', 0o644),
    dirPermissions: getEnvNumber('DIR_PERMISSIONS', 0o755),
    
    // 高级配置 / Advanced Configuration
    envPrefix: getEnvValue('ENV_PREFIX', 'SUPERDESIGN_'),
    enableConfigWatching: getEnvBoolean('ENABLE_CONFIG_WATCHING', false),
    tempDir: getDefaultTempDir(),
    enableAutoBackup: getEnvBoolean('ENABLE_AUTO_BACKUP', false),
    backupRetentionCount: getEnvNumber('BACKUP_RETENTION_COUNT', 5),
  };
}

/**
 * 全局配置实例
 * Global configuration instance
 */
export const appConfig: SuperdesignConfig = createConfig();

/**
 * 获取完整的Superdesign目录路径
 * Get full Superdesign directory path
 */
export function getSuperdeignDirectoryPath(workspacePath?: string): string {
  const basePath = workspacePath || appConfig.workspacePath;
  return path.join(basePath, appConfig.superdesignDirName);
}

/**
 * 获取设计迭代目录路径
 * Get design iterations directory path
 */
export function getDesignIterationsPath(workspacePath?: string): string {
  const superdesignDir = getSuperdeignDirectoryPath(workspacePath);
  return path.join(superdesignDir, appConfig.designIterationsDir);
}

/**
 * 获取设计系统目录路径
 * Get design system directory path
 */
export function getDesignSystemPath(workspacePath?: string): string {
  const superdesignDir = getSuperdeignDirectoryPath(workspacePath);
  return path.join(superdesignDir, appConfig.designSystemDir);
}

/**
 * 日志输出函数
 * Logging function
 */
export function log(level: LogLevel, message: string, ...args: any[]): void {
  if (!shouldLog(level)) return;
  
  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
  
  switch (level) {
    case LogLevel.ERROR:
      console.error(prefix, message, ...args);
      break;
    case LogLevel.WARN:
      console.warn(prefix, message, ...args);
      break;
    case LogLevel.INFO:
      console.info(prefix, message, ...args);
      break;
    case LogLevel.DEBUG:
      if (appConfig.debug) {
        console.debug(prefix, message, ...args);
      }
      break;
  }
}

/**
 * 检查是否应该输出指定级别的日志
 * Check if log level should be output
 */
function shouldLog(level: LogLevel): boolean {
  const levels = [LogLevel.ERROR, LogLevel.WARN, LogLevel.INFO, LogLevel.DEBUG];
  const currentLevelIndex = levels.indexOf(appConfig.logLevel);
  const messageLevelIndex = levels.indexOf(level);
  
  return messageLevelIndex <= currentLevelIndex;
}

/**
 * 性能监控装饰器
 * Performance monitoring decorator
 */
export function performanceMonitor(target: any, propertyName: string, descriptor: PropertyDescriptor) {
  if (!appConfig.enablePerformanceMonitoring) return descriptor;
  
  const method = descriptor.value;
  
  descriptor.value = function (...args: any[]) {
    const start = Date.now();
    const result = method.apply(this, args);
    
    if (result instanceof Promise) {
      return result.finally(() => {
        const duration = Date.now() - start;
        log(LogLevel.DEBUG, `Performance: ${propertyName} took ${duration}ms`);
      });
    } else {
      const duration = Date.now() - start;
      log(LogLevel.DEBUG, `Performance: ${propertyName} took ${duration}ms`);
      return result;
    }
  };
  
  return descriptor;
}
