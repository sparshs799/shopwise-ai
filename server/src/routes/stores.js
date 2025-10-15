/**
 * Stores API Routes
 * Information about available retailers
 * 
 * @author Sparsh Srivastava
 */

const express = require('express');
const router = express.Router();
const { getStores } = require('../services/productFetcher');

/**
 * GET /api/stores
 * Get list of all available stores
 */
router.get('/', async (req, res) => {
  try {
    const stores = getStores();
    res.json({ success: true, stores });
  } catch (error) {
    console.error('Stores error:', error);
    res.status(500).json({ error: 'Failed to fetch stores' });
  }
});

/**
 * GET /api/stores/:slug
 * Get details about a specific store
 */
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const stores = getStores();
    const store = stores.find(s => s.slug === slug);

    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }

    res.json({ success: true, store });
  } catch (error) {
    console.error('Store detail error:', error);
    res.status(500).json({ error: 'Failed to fetch store details' });
  }
});

module.exports = router;
