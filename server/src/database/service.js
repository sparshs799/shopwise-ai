/**
 * Database Service - Centralized database operations
 * Replaces direct query usage across the application
 * 
 * @author GitHub Copilot Enhancement
 * @date October 14, 2025
 */

const { pool } = require('./connection');

class DatabaseService {
  /**
   * Search Queries
   */
  async logSearchQuery(queryText, parsedFilters, resultCount, sessionId = null) {
    // Skip if in demo mode
    if (process.env.SKIP_DB_CHECK === 'true' || !pool) {
      console.log('📊 Would log search:', { queryText, resultCount });
      return { id: 'demo', query_text: queryText };
    }
    
    try {
      const result = await pool.query(
        `INSERT INTO search_queries (query_text, parsed_filters, result_count, session_id)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [queryText, JSON.stringify(parsedFilters), resultCount, sessionId]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error logging search query:', error);
      throw error;
    }
  }

  async getRecentSearches(limit = 10) {
    try {
      const result = await pool.query(
        `SELECT query_text, parsed_filters, result_count, created_at
         FROM search_queries
         ORDER BY created_at DESC
         LIMIT $1`,
        [limit]
      );
      return result.rows;
    } catch (error) {
      console.error('Error fetching recent searches:', error);
      throw error;
    }
  }

  async getPopularSearches(limit = 10, days = 7) {
    try {
      const result = await pool.query(
        `SELECT query_text, COUNT(*) as search_count
         FROM search_queries
         WHERE created_at > NOW() - INTERVAL '${days} days'
         GROUP BY query_text
         ORDER BY search_count DESC
         LIMIT $1`,
        [limit]
      );
      return result.rows;
    } catch (error) {
      console.error('Error fetching popular searches:', error);
      throw error;
    }
  }

  /**
   * Products
   */
  async createProduct(productData) {
    const { external_id, name, category, brand, image_url, description, specs } = productData;
    
    try {
      const result = await pool.query(
        `INSERT INTO products (external_id, name, category, brand, image_url, description, specs)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (external_id) DO UPDATE
         SET name = EXCLUDED.name,
             category = EXCLUDED.category,
             brand = EXCLUDED.brand,
             image_url = EXCLUDED.image_url,
             description = EXCLUDED.description,
             specs = EXCLUDED.specs,
             updated_at = NOW()
         RETURNING *`,
        [external_id, name, category, brand, image_url, description, JSON.stringify(specs)]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  async getProductById(productId) {
    try {
      const result = await pool.query(
        'SELECT * FROM products WHERE id = $1',
        [productId]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  }

  async searchProducts(searchText, category = null, limit = 50) {
    try {
      let query = `
        SELECT p.*, 
               ts_rank(search_vector, plainto_tsquery('english', $1)) as rank
        FROM products p
        WHERE search_vector @@ plainto_tsquery('english', $1)
      `;
      
      const params = [searchText];
      
      if (category) {
        query += ' AND category = $2';
        params.push(category);
        query += ` ORDER BY rank DESC LIMIT $3`;
        params.push(limit);
      } else {
        query += ` ORDER BY rank DESC LIMIT $2`;
        params.push(limit);
      }

      const result = await pool.query(query, params);
      return result.rows;
    } catch (error) {
      console.error('Error searching products:', error);
      throw error;
    }
  }

  /**
   * Product Prices
   */
  async upsertProductPrice(priceData) {
    const {
      product_id,
      store_id,
      price,
      original_price,
      in_stock,
      stock_level,
      delivery_available,
      delivery_price,
      delivery_eta,
      pickup_available,
      pickup_price,
      product_url
    } = priceData;

    try {
      const result = await pool.query(
        `INSERT INTO product_prices (
          product_id, store_id, price, original_price, in_stock, stock_level,
          delivery_available, delivery_price, delivery_eta,
          pickup_available, pickup_price, product_url
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        ON CONFLICT (product_id, store_id) DO UPDATE
        SET price = EXCLUDED.price,
            original_price = EXCLUDED.original_price,
            in_stock = EXCLUDED.in_stock,
            stock_level = EXCLUDED.stock_level,
            delivery_available = EXCLUDED.delivery_available,
            delivery_price = EXCLUDED.delivery_price,
            delivery_eta = EXCLUDED.delivery_eta,
            pickup_available = EXCLUDED.pickup_available,
            pickup_price = EXCLUDED.pickup_price,
            product_url = EXCLUDED.product_url,
            scraped_at = NOW()
        RETURNING *`,
        [
          product_id, store_id, price, original_price, in_stock, stock_level,
          delivery_available, delivery_price, delivery_eta,
          pickup_available, pickup_price, product_url
        ]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error upserting product price:', error);
      throw error;
    }
  }

  async getProductPrices(productId) {
    try {
      const result = await pool.query(
        `SELECT pp.*, s.name as store_name, s.slug as store_slug, s.logo_url
         FROM product_prices pp
         JOIN stores s ON pp.store_id = s.id
         WHERE pp.product_id = $1
         ORDER BY pp.price ASC`,
        [productId]
      );
      return result.rows;
    } catch (error) {
      console.error('Error fetching product prices:', error);
      throw error;
    }
  }

  /**
   * Price History
   */
  async logPriceHistory(productId, storeId, price) {
    try {
      const result = await pool.query(
        `INSERT INTO price_history (product_id, store_id, price)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [productId, storeId, price]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error logging price history:', error);
      throw error;
    }
  }

  async getPriceHistory(productId, storeId = null, days = 30) {
    try {
      let query = `
        SELECT ph.*, s.name as store_name, s.slug as store_slug
        FROM price_history ph
        JOIN stores s ON ph.store_id = s.id
        WHERE ph.product_id = $1
          AND ph.recorded_at > NOW() - INTERVAL '${days} days'
      `;
      
      const params = [productId];
      
      if (storeId) {
        query += ' AND ph.store_id = $2';
        params.push(storeId);
      }
      
      query += ' ORDER BY ph.recorded_at ASC';

      const result = await pool.query(query, params);
      return result.rows;
    } catch (error) {
      console.error('Error fetching price history:', error);
      throw error;
    }
  }

  /**
   * Stores
   */
  async getAllStores() {
    try {
      const result = await pool.query(
        'SELECT * FROM stores ORDER BY name ASC'
      );
      return result.rows;
    } catch (error) {
      console.error('Error fetching stores:', error);
      throw error;
    }
  }

  async getStoreBySlug(slug) {
    try {
      const result = await pool.query(
        'SELECT * FROM stores WHERE slug = $1',
        [slug]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error fetching store:', error);
      throw error;
    }
  }

  /**
   * Favorites
   */
  async addFavorite(sessionId, productId) {
    try {
      const result = await pool.query(
        `INSERT INTO favorites (session_id, product_id)
         VALUES ($1, $2)
         ON CONFLICT (session_id, product_id) DO NOTHING
         RETURNING *`,
        [sessionId, productId]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error adding favorite:', error);
      throw error;
    }
  }

  async removeFavorite(sessionId, productId) {
    try {
      await pool.query(
        'DELETE FROM favorites WHERE session_id = $1 AND product_id = $2',
        [sessionId, productId]
      );
    } catch (error) {
      console.error('Error removing favorite:', error);
      throw error;
    }
  }

  async getFavorites(sessionId) {
    try {
      const result = await pool.query(
        `SELECT p.*, f.created_at as favorited_at
         FROM favorites f
         JOIN products p ON f.product_id = p.id
         WHERE f.session_id = $1
         ORDER BY f.created_at DESC`,
        [sessionId]
      );
      return result.rows;
    } catch (error) {
      console.error('Error fetching favorites:', error);
      throw error;
    }
  }

  /**
   * Analytics
   */
  async getSearchAnalytics(days = 7) {
    try {
      const result = await pool.query(
        `SELECT 
           DATE(created_at) as date,
           COUNT(*) as total_searches,
           AVG(result_count) as avg_results,
           COUNT(DISTINCT session_id) as unique_users
         FROM search_queries
         WHERE created_at > NOW() - INTERVAL '${days} days'
         GROUP BY DATE(created_at)
         ORDER BY date DESC`
      );
      return result.rows;
    } catch (error) {
      console.error('Error fetching analytics:', error);
      throw error;
    }
  }

  async getCategoryStats() {
    try {
      const result = await pool.query(
        `SELECT 
           category,
           COUNT(*) as product_count,
           AVG(pp.price) as avg_price
         FROM products p
         LEFT JOIN product_prices pp ON p.id = pp.product_id
         GROUP BY category
         ORDER BY product_count DESC`
      );
      return result.rows;
    } catch (error) {
      console.error('Error fetching category stats:', error);
      throw error;
    }
  }
}

module.exports = new DatabaseService();
