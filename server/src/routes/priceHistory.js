/**
 * Price History API Routes
 * Track and retrieve product price history
 * 
 * @author Sparsh Srivastava
 */

const express = require('express');
const router = express.Router();
const { getPriceHistory } = require('../services/productFetcher');

/**
 * GET /api/price-history/:productId
 * Get price history for a product
 */
router.get('/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const { days = 30, store } = req.query;

    const history = await getPriceHistory(productId, store, parseInt(days));

    res.json({ success: true, history });
  } catch (error) {
    console.error('Price history error:', error);
    res.status(500).json({ error: 'Failed to fetch price history' });
  }
});

module.exports = router;
