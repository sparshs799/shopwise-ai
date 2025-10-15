/**
 * Suggestions API Routes
 * Smart query suggestions and autocomplete
 * 
 * @author Sparsh Srivastava
 */

const express = require('express');
const router = express.Router();
const { getQuerySuggestions } = require('../services/aiParser');

/**
 * GET /api/suggestions?q=gaming
 * Get query suggestions based on partial input
 */
router.get('/', async (req, res) => {
  try {
    const { q } = req.query;
    const suggestions = getQuerySuggestions(q || '');
    
    res.json({ success: true, suggestions });
  } catch (error) {
    console.error('Suggestions error:', error);
    res.status(500).json({ error: 'Failed to fetch suggestions' });
  }
});

module.exports = router;
