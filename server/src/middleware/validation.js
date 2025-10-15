/**
 * Request Validation Middleware
 * Validates and sanitizes incoming API requests
 * 
 * @author GitHub Copilot Enhancement
 * @date October 14, 2025
 */

const Joi = require('joi');

/**
 * Validation schemas
 */
const schemas = {
  search: Joi.object({
    query: Joi.string()
      .trim()
      .min(2)
      .max(500)
      .required()
      .messages({
        'string.empty': 'Search query cannot be empty',
        'string.min': 'Search query must be at least 2 characters',
        'string.max': 'Search query cannot exceed 500 characters',
        'any.required': 'Search query is required',
      }),
    filters: Joi.object({
      category: Joi.string().trim().max(100).optional(),
      brand: Joi.alternatives().try(
        Joi.string().trim().max(100),
        Joi.array().items(Joi.string().trim().max(100))
      ).optional(),
      minPrice: Joi.number().min(0).optional(),
      maxPrice: Joi.number().min(0).optional(),
      specs: Joi.object().optional(),
      features: Joi.array().items(Joi.string()).optional(),
      stores: Joi.array().items(Joi.string()).optional(),
    }).optional(),
  }),

  productId: Joi.object({
    id: Joi.string()
      .uuid()
      .required()
      .messages({
        'string.guid': 'Invalid product ID format',
        'any.required': 'Product ID is required',
      }),
  }),

  priceHistory: Joi.object({
    productId: Joi.string().uuid().required(),
    storeId: Joi.string().uuid().optional(),
    days: Joi.number().integer().min(1).max(365).default(30),
  }),

  favorite: Joi.object({
    productId: Joi.string().uuid().required(),
    sessionId: Joi.string().trim().required(),
  }),

  pagination: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
    sortBy: Joi.string().valid('price', 'relevance', 'name', 'rating').default('relevance'),
    order: Joi.string().valid('asc', 'desc').default('asc'),
  }),
};

/**
 * Validation middleware factory
 */
function validate(schema, property = 'body') {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors,
      });
    }

    // Replace request property with validated and sanitized value
    req[property] = value;
    next();
  };
}

/**
 * Sanitize input to prevent XSS
 */
function sanitizeInput(input) {
  if (typeof input === 'string') {
    return input
      .replace(/[<>]/g, '') // Remove < and >
      .trim();
  }
  return input;
}

/**
 * Sanitize middleware
 */
function sanitize(req, res, next) {
  // Sanitize body
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      req.body[key] = sanitizeInput(req.body[key]);
    });
  }

  // Sanitize query params
  if (req.query) {
    Object.keys(req.query).forEach(key => {
      req.query[key] = sanitizeInput(req.query[key]);
    });
  }

  next();
}

module.exports = {
  validate,
  sanitize,
  schemas,
};
