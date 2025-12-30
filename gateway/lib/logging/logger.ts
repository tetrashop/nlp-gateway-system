import { NextRequest } from 'next/server';

export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR'
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  serviceId: string;
  message: string;
  data?: any;
  requestId?: string;
  userId?: string;
  ip?: string;
  processingTime?: number;
}

export class Logger {
  private logs: LogEntry[] = [];
  private maxLogs: number = 10000;
  private logLevel: LogLevel = LogLevel.INFO;

  constructor(level: LogLevel = LogLevel.INFO) {
    this.logLevel = level;
  }

  // ثبت لاگ
  log(entry: Omit<LogEntry, 'timestamp'>) {
    const logEntry: LogEntry = {
      ...entry,
      timestamp: new Date().toISOString()
    };

    // فیلتر بر اساس سطح لاگ
    if (this.shouldLog(entry.level)) {
      this.logs.push(logEntry);
      
      // حفظ اندازه آرایه
      if (this.logs.length > this.maxLogs) {
        this.logs = this.logs.slice(-this.maxLogs);
      }

      // چاپ در کنسول (در حالت توسعه)
      if (process.env.NODE_ENV === 'development') {
        this.printLog(logEntry);
      }
    }
  }

  // لاگ سطح INFO
  info(serviceId: string, message: string, data?: any) {
    this.log({
      level: LogLevel.INFO,
      serviceId,
      message,
      data
    });
  }

  // لاگ سطح ERROR
  error(serviceId: string, message: string, error?: Error, data?: any) {
    this.log({
      level: LogLevel.ERROR,
      serviceId,
      message,
      data: {
        ...data,
        error: error?.message,
        stack: error?.stack
      }
    });
  }

  // لاگ سطح WARN
  warn(serviceId: string, message: string, data?: any) {
    this.log({
      level: LogLevel.WARN,
      serviceId,
      message,
      data
    });
  }

  // لاگ سطح DEBUG
  debug(serviceId: string, message: string, data?: any) {
    this.log({
      level: LogLevel.DEBUG,
      serviceId,
      message,
      data
    });
  }

  // لاگ درخواست API
  logRequest(request: NextRequest, serviceId: string, processingTime: number, success: boolean) {
    this.info(serviceId, 'API Request', {
      method: request.method,
      url: request.url,
      processingTime,
      success,
      ip: request.ip,
      userAgent: request.headers.get('user-agent')
    });
  }

  // بررسی آیا باید لاگ ثبت شود
  private shouldLog(level: LogLevel): boolean {
    const levels = [LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR];
    return levels.indexOf(level) >= levels.indexOf(this.logLevel);
  }

  // چاپ لاگ در کنسول
  private printLog(entry: LogEntry) {
    const colors = {
      [LogLevel.DEBUG]: '\x1b[36m', // Cyan
      [LogLevel.INFO]: '\x1b[32m',  // Green
      [LogLevel.WARN]: '\x1b[33m',  // Yellow
      [LogLevel.ERROR]: '\x1b[31m'  // Red
    };

    const reset = '\x1b[0m';
    const time = new Date(entry.timestamp).toLocaleTimeString('fa-IR');
    
    console.log(
      `${colors[entry.level]}[${entry.level}]${reset} ${time} ${entry.serviceId}: ${entry.message}`
    );

    if (entry.data) {
      console.log('Data:', JSON.stringify(entry.data, null, 2));
    }
  }

  // دریافت لاگ‌ها
  getLogs(filter?: { level?: LogLevel; serviceId?: string; startTime?: string; endTime?: string }): LogEntry[] {
    let filtered = this.logs;

    if (filter?.level) {
      filtered = filtered.filter(log => log.level === filter.level);
    }

    if (filter?.serviceId) {
      filtered = filtered.filter(log => log.serviceId === filter.serviceId);
    }

    if (filter?.startTime) {
      filtered = filtered.filter(log => log.timestamp >= filter.startTime!);
    }

    if (filter?.endTime) {
      filtered = filtered.filter(log => log.timestamp <= filter.endTime!);
    }

    return filtered;
  }

  // پاک کردن لاگ‌ها
  clearLogs() {
    this.logs = [];
  }

  // دریافت آمار لاگ‌ها
  getStats() {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000).toISOString();
    
    const recentLogs = this.logs.filter(log => log.timestamp >= oneHourAgo);
    
    return {
      totalLogs: this.logs.length,
      recentLogs: recentLogs.length,
      byLevel: this.logs.reduce((acc, log) => {
        acc[log.level] = (acc[log.level] || 0) + 1;
        return acc;
      }, {} as Record<LogLevel, number>),
      byService: this.logs.reduce((acc, log) => {
        acc[log.serviceId] = (acc[log.serviceId] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };
  }

  // تغییر سطح لاگ
  setLogLevel(level: LogLevel) {
    this.logLevel = level;
  }
}

// نمونه Singleton
export const logger = new Logger(
  process.env.NODE_ENV === 'development' ? LogLevel.DEBUG : LogLevel.INFO
);
