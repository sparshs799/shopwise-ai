/**
 * Enhanced Logger Service
 * Structured logging with Winston for better debugging and monitoring
 * 
 * @author GitHub Copilot Enhancement
 * @date October 14, 2025
 */

const winston = require('winston');
const path = require('path');

// Custom format for console output
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let metaStr = '';
    if (Object.keys(meta).length > 0) {
      metaStr = '\n' + JSON.stringify(meta, null, 2);
    }
    return `${timestamp} [${level}]: ${message}${metaStr}`;
  })
);

// Custom format for file output
const fileFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.json()
);

// Create logs directory if it doesn't exist
const fs = require('fs');
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Create logger instance
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  defaultMeta: { service: 'shopwise-api' },
  transports: [
    // Error logs
    new winston.transports.File({
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
      format: fileFormat,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    // Combined logs
    new winston.transports.File({
      filename: path.join(logsDir, 'combined.log'),
      format: fileFormat,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    // Search-specific logs
    new winston.transports.File({
      filename: path.join(logsDir, 'searches.log'),
      level: 'info',
      format: fileFormat,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  ],
});

// Console logging for development
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: consoleFormat,
    })
  );
}

// Helper methods for common logging scenarios
const loggerHelpers = {
  /**
   * Log search request
   */
  logSearch: (query, filters, resultCount, duration) => {
    logger.info('Search request completed', {
      type: 'search',
      query,
      filters,
      resultCount,
      duration: `${duration}ms`,
    });
  },

  /**
   * Log API request
   */
  logRequest: (req, res, duration) => {
    logger.info('API request', {
      type: 'request',
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('user-agent'),
    });
  },

  /**
   * Log external API call
   */
  logExternalAPI: (service, endpoint, success, duration, error = null) => {
    const logData = {
      type: 'external-api',
      service,
      endpoint,
      success,
      duration: `${duration}ms`,
    };

    if (error) {
      logData.error = error.message;
      logger.error('External API call failed', logData);
    } else {
      logger.info('External API call', logData);
    }
  },

  /**
   * Log AI parsing
   */
  logAIParsing: (query, provider, success, duration, error = null) => {
    const logData = {
      type: 'ai-parsing',
      query,
      provider,
      success,
      duration: `${duration}ms`,
    };

    if (error) {
      logData.error = error.message;
      logger.error('AI parsing failed', logData);
    } else {
      logger.info('AI parsing completed', logData);
    }
  },

  /**
   * Log cache operations
   */
  logCache: (operation, key, hit = null) => {
    const logData = {
      type: 'cache',
      operation,
      key,
    };

    if (hit !== null) {
      logData.hit = hit;
    }

    logger.debug('Cache operation', logData);
  },

  /**
   * Log database operations
   */
  logDatabase: (operation, table, success, duration, error = null) => {
    const logData = {
      type: 'database',
      operation,
      table,
      success,
      duration: `${duration}ms`,
    };

    if (error) {
      logData.error = error.message;
      logger.error('Database operation failed', logData);
    } else {
      logger.debug('Database operation', logData);
    }
  },

  /**
   * Log performance metrics
   */
  logMetrics: (metric, value, tags = {}) => {
    logger.info('Performance metric', {
      type: 'metric',
      metric,
      value,
      ...tags,
    });
  },
};

// Export both the logger and helper methods
module.exports = {
  logger,
  ...loggerHelpers,
};
