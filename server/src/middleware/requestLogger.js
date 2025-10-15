/**
 * Request Logging Middleware
 * Logs all incoming requests with timing information
 * 
 * @author GitHub Copilot Enhancement
 * @date October 14, 2025
 */

const { logRequest } = require('../utils/logger');

/**
 * Request logger middleware
 */
function requestLogger(req, res, next) {
  const startTime = Date.now();

  // Log request completion
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    logRequest(req, res, duration);
  });

  next();
}

/**
 * Error logger middleware
 */
function errorLogger(err, req, res, next) {
  const { logger } = require('../utils/logger');
  
  logger.error('Request error', {
    type: 'error',
    error: err.message,
    stack: err.stack,
    method: req.method,
    path: req.path,
    ip: req.ip,
  });

  next(err);
}

module.exports = {
  requestLogger,
  errorLogger,
};
