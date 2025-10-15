/**
 * ShopWise AI Backend Server
 * Main entry point for the Express server
 * 
 * @author Sparsh Srivastava
 * @description AI-driven shopping aggregator backend
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

// Import enhanced logging and middleware
const { logger } = require('./utils/logger');
const { requestLogger, errorLogger } = require('./middleware/requestLogger');
const { sanitize } = require('./middleware/validation');

// Import routes
const searchRoutes = require('./routes/search');
const productsRoutes = require('./routes/products');
const storesRoutes = require('./routes/stores');
const suggestionsRoutes = require('./routes/suggestions');
const favoritesRoutes = require('./routes/favorites');
const priceHistoryRoutes = require('./routes/priceHistory');

// Import database connection
const { testConnection } = require('./database/connection');

const app = express();
const PORT = process.env.PORT || 3001;

// Allow CORS from Vercel domain
const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://shopwise-ai.vercel.app',
  'https://shopwise-ai-git-main-sparsh-srivastavas-projects-20659e85.vercel.app',
  /\.vercel\.app$/
];

// ========================================
// MIDDLEWARE CONFIGURATION
// ========================================

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS configuration - Allow Vercel frontend
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Check if origin is allowed
    const isAllowed = ALLOWED_ORIGINS.some(allowedOrigin => {
      if (allowedOrigin instanceof RegExp) {
        return allowedOrigin.test(origin);
      }
      return allowedOrigin === origin;
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      console.log('Blocked by CORS:', origin);
      callback(null, true); // Allow all for now (you can restrict later)
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging and sanitization
app.use(requestLogger);
app.use(sanitize);

// Compression middleware
app.use(compression());

// Logging middleware (only in development)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Rate limiting to prevent abuse
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

app.use('/api/', limiter);

// ========================================
// API ROUTES
// ========================================

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API routes
app.use('/api/search', searchRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/stores', storesRoutes);
app.use('/api/suggestions', suggestionsRoutes);
app.use('/api/favorites', favoritesRoutes);
app.use('/api/price-history', priceHistoryRoutes);

// Error logging middleware (before error handler)
app.use(errorLogger);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.path 
  });
});

// Global error handler
app.use((err, req, res, next) => {
  logger.error('Global error handler', {
    error: err.message,
    stack: err.stack,
    path: req.path
  });
  
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// ========================================
// SERVER INITIALIZATION
// ========================================

async function startServer() {
  try {
    // Test database connection
    await testConnection();
    logger.info('Database connection established');

    // Start server
    app.listen(PORT, () => {
      logger.info(`
╔═══════════════════════════════════════════╗
║                                           ║
║        🛍️  ShopWise AI Server            ║
║        Your Intelligent Shopping API      ║
║                                           ║
║  Status: RUNNING                          ║
║  Port: ${PORT}                           ║
║  Environment: ${process.env.NODE_ENV || 'development'}              ║
║  URL: http://localhost:${PORT}           ║
║                                           ║
║  Built by Sparsh Srivastava              ║
║                                           ║
╚═══════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    logger.error('Failed to start server', { error: error.message });
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT signal received: closing HTTP server');
  process.exit(0);
});

// Start the server
startServer();

module.exports = app;
