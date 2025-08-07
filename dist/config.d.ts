/**
 * 平台类型枚举
 * Platform type enumeration
 */
export declare enum Platform {
    WINDOWS = "win32",
    MACOS = "darwin",
    LINUX = "linux"
}
/**
 * 日志级别枚举
 * Log level enumeration
 */
export declare enum LogLevel {
    ERROR = "error",
    WARN = "warn",
    INFO = "info",
    DEBUG = "debug"
}
/**
 * 配置接口定义
 * Configuration interface definition
 */
export interface SuperdesignConfig {
    serverName: string;
    serverVersion: string;
    workspacePath: string;
    superdesignDirName: string;
    designIterationsDir: string;
    designSystemDir: string;
    mcpServerPath: string;
    nodeExecutable: string;
    liveGalleryPort: number;
    httpTimeout: number;
    defaultVariations: number;
    maxVariations: number;
    defaultCleanupDays: number;
    defaultCleanupCount: number;
    maxFileSize: number;
    debug: boolean;
    logLevel: LogLevel;
    enablePerformanceMonitoring: boolean;
    platform: Platform;
    windowsLongPathSupport: boolean;
    filePermissions: number;
    dirPermissions: number;
    envPrefix: string;
    enableConfigWatching: boolean;
    tempDir: string;
    enableAutoBackup: boolean;
    backupRetentionCount: number;
}
/**
 * 全局配置实例
 * Global configuration instance
 */
export declare const appConfig: SuperdesignConfig;
/**
 * 获取完整的Superdesign目录路径
 * Get full Superdesign directory path
 */
export declare function getSuperdeignDirectoryPath(workspacePath?: string): string;
/**
 * 获取设计迭代目录路径
 * Get design iterations directory path
 */
export declare function getDesignIterationsPath(workspacePath?: string): string;
/**
 * 获取设计系统目录路径
 * Get design system directory path
 */
export declare function getDesignSystemPath(workspacePath?: string): string;
/**
 * 日志输出函数
 * Logging function
 */
export declare function log(level: LogLevel, message: string, ...args: any[]): void;
/**
 * 性能监控装饰器
 * Performance monitoring decorator
 */
export declare function performanceMonitor(target: any, propertyName: string, descriptor: PropertyDescriptor): PropertyDescriptor;
