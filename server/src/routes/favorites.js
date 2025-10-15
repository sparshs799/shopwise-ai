/**
 * Favorites API Routes
 * Save and manage favorite products
 * 
 * @author Sparsh Srivastava
 */

const express = require('express');
const router = express.Router();

// In-memory storage for demo (use database in production)
const favorites = new Map();

/**
 * GET /api/favorites
 * Get user's favorite products
 */
router.get('/', async (req, res) => {
  try {
    const sessionId = req.headers['x-session-id'] || 'demo-session';
    const userFavorites = favorites.get(sessionId) || [];
    
    res.json({ success: true, favorites: userFavorites });
  } catch (error) {
    console.error('Favorites fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch favorites' });
  }
});

/**
 * POST /api/favorites
 * Add a product to favorites
 * 
 * Body: { productId: "demo-1" }
 */
router.post('/', async (req, res) => {
  try {
    const { productId } = req.body;
    const sessionId = req.headers['x-session-id'] || 'demo-session';

    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required' });
    }

    let userFavorites = favorites.get(sessionId) || [];
    
    if (!userFavorites.includes(productId)) {
      userFavorites.push(productId);
      favorites.set(sessionId, userFavorites);
    }

    res.json({ success: true, favorites: userFavorites });
  } catch (error) {
    console.error('Add favorite error:', error);
    res.status(500).json({ error: 'Failed to add favorite' });
  }
});

/**
 * DELETE /api/favorites/:productId
 * Remove a product from favorites
 */
router.delete('/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const sessionId = req.headers['x-session-id'] || 'demo-session';

    let userFavorites = favorites.get(sessionId) || [];
    userFavorites = userFavorites.filter(id => id !== productId);
    favorites.set(sessionId, userFavorites);

    res.json({ success: true, favorites: userFavorites });
  } catch (error) {
    console.error('Remove favorite error:', error);
    res.status(500).json({ error: 'Failed to remove favorite' });
  }
});

module.exports = router;
