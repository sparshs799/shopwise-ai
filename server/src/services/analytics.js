/**
 * Analytics Service
 * Tracks and analyzes user behavior and search patterns
 * 
 * @author GitHub Copilot Enhancement
 * @date October 14, 2025
 */

const db = require('../database/service');
const { logger } = require('../utils/logger');

class AnalyticsService {
  /**
   * Track search event
   */
  async trackSearch(query, filters, results, sessionId = null, duration = 0) {
    try {
      await db.logSearchQuery(query, filters, results.length, sessionId);

      logger.info('Search tracked', {
        query,
        resultCount: results.length,
        duration,
        sessionId,
      });
    } catch (error) {
      logger.error('Failed to track search', { error: error.message });
    }
  }

  /**
   * Track product view
   */
  async trackProductView(productId, sessionId, referrer = null) {
    try {
      // Log to analytics (could be Google Analytics, Mixpanel, etc.)
      logger.info('Product viewed', {
        productId,
        sessionId,
        referrer,
      });
    } catch (error) {
      logger.error('Failed to track product view', { error: error.message });
    }
  }

  /**
   * Track store click (user clicks through to store)
   */
  async trackStoreClick(productId, storeSlug, sessionId) {
    try {
      logger.info('Store click', {
        productId,
        storeSlug,
        sessionId,
      });
    } catch (error) {
      logger.error('Failed to track store click', { error: error.message });
    }
  }

  /**
   * Get search analytics
   */
  async getSearchAnalytics(days = 7) {
    try {
      const analytics = await db.getSearchAnalytics(days);
      return analytics;
    } catch (error) {
      logger.error('Failed to get search analytics', { error: error.message });
      throw error;
    }
  }

  /**
   * Get popular searches
   */
  async getPopularSearches(limit = 10, days = 7) {
    try {
      const popular = await db.getPopularSearches(limit, days);
      return popular;
    } catch (error) {
      logger.error('Failed to get popular searches', { error: error.message });
      throw error;
    }
  }

  /**
   * Get category statistics
   */
  async getCategoryStats() {
    try {
      const stats = await db.getCategoryStats();
      return stats;
    } catch (error) {
      logger.error('Failed to get category stats', { error: error.message });
      throw error;
    }
  }

  /**
   * Generate search suggestions based on popular queries
   */
  async generateSearchSuggestions(prefix, limit = 5) {
    try {
      const popular = await db.getPopularSearches(50, 30);
      
      // Filter by prefix and return top matches
      const suggestions = popular
        .filter(item => item.query_text.toLowerCase().startsWith(prefix.toLowerCase()))
        .slice(0, limit)
        .map(item => item.query_text);

      return suggestions;
    } catch (error) {
      logger.error('Failed to generate suggestions', { error: error.message });
      return [];
    }
  }

  /**
   * Get trending searches (searches with increasing frequency)
   */
  async getTrendingSearches(limit = 10) {
    try {
      // Get searches from last 7 days vs previous 7 days
      // Calculate growth rate
      // This is a simplified version
      const recent = await db.getPopularSearches(limit, 7);
      return recent;
    } catch (error) {
      logger.error('Failed to get trending searches', { error: error.message });
      return [];
    }
  }

  /**
   * Generate daily report
   */
  async generateDailyReport() {
    try {
      const [analytics, popular, trending, categoryStats] = await Promise.all([
        this.getSearchAnalytics(1),
        this.getPopularSearches(10, 1),
        this.getTrendingSearches(10),
        this.getCategoryStats(),
      ]);

      return {
        date: new Date().toISOString().split('T')[0],
        analytics: analytics[0] || {},
        popularSearches: popular,
        trendingSearches: trending,
        categoryStats,
      };
    } catch (error) {
      logger.error('Failed to generate daily report', { error: error.message });
      throw error;
    }
  }
}

module.exports = new AnalyticsService();
