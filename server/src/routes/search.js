/**
 * Search API Routes
 * Handles natural language product searches
 * 
 * @author Sparsh Srivastava
 */

const express = require('express');
const router = express.Router();
const { parseQuery } = require('../services/aiParser');
const { fetchProducts } = require('../services/productFetcher');
const { rankResults } = require('../services/ranker');
const { validate, schemas } = require('../middleware/validation');
const { logger, logSearch } = require('../utils/logger');
const analytics = require('../services/analytics');

/**
 * POST /api/search
 * Main search endpoint
 * 
 * Body: { query: "gaming laptops with RTX 5090 under $3000" }
 */
router.post('/', validate(schemas.search), async (req, res) => {
  const startTime = Date.now();
  
  try {
    const { query } = req.body;

    logger.info(`Search request received: "${query}"`);

    // Step 1: Parse natural language query into filters
    const filters = await parseQuery(query);
    logger.debug('Parsed filters', { filters });

    // Step 2: Fetch products from multiple sources
    const products = await fetchProducts(filters);
    logger.debug(`Fetched ${products.length} products`);

    // Step 3: Rank and sort results
    const rankedProducts = rankResults(products, filters);
    
    const duration = Date.now() - startTime;
    
    // Step 4: Log search analytics
    logSearch(query, filters, rankedProducts.length, duration);
    
    // Track in analytics (non-blocking)
    analytics.trackSearch(query, filters, rankedProducts, req.sessionID, duration).catch(err => {
      logger.error('Analytics tracking failed', { error: err.message });
    });
    
    logger.info(`Search completed: ${rankedProducts.length} results in ${duration}ms`);
    
    res.json({
      success: true,
      query,
      filters,
      results: rankedProducts,
      count: rankedProducts.length
    });

  } catch (error) {
    logger.error('Search error', { error: error.message, stack: error.stack });
    res.status(500).json({ 
      error: 'Failed to process search',
      message: error.message 
    });
  }
});

/**
 * GET /api/search/history
 * Get recent search queries (for logged users or session)
 */
router.get('/history', async (req, res) => {
  try {
    // Mock history - in production, fetch from database
    const history = [
      { query: 'gaming laptops with RTX 5090', timestamp: new Date(Date.now() - 3600000) },
      { query: 'wireless headphones under $200', timestamp: new Date(Date.now() - 7200000) },
      { query: '4K monitors for photo editing', timestamp: new Date(Date.now() - 86400000) }
    ];

    res.json({ success: true, history });
  } catch (error) {
    logger.error('History error', { error: error.message });
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

module.exports = router;
