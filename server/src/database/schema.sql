/**
 * Database Schema for ShopWise AI
 * Run this SQL in your PostgreSQL or Supabase SQL Editor
 * 
 * @author Sparsh Srivastava
 */

-- ========================================
-- TABLE: products
-- Stores normalized product information
-- ========================================
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_id VARCHAR(255) UNIQUE,
  name VARCHAR(500) NOT NULL,
  category VARCHAR(100),
  brand VARCHAR(100),
  image_url TEXT,
  description TEXT,
  
  -- Specifications (JSON for flexibility)
  specs JSONB DEFAULT '{}',
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Search optimization
  search_vector tsvector
);

-- Create index for full-text search
CREATE INDEX IF NOT EXISTS products_search_idx ON products USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS products_category_idx ON products(category);
CREATE INDEX IF NOT EXISTS products_brand_idx ON products(brand);

-- ========================================
-- TABLE: stores
-- Stores information about retailers
-- ========================================
CREATE TABLE IF NOT EXISTS stores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  logo_url TEXT,
  website_url TEXT,
  api_available BOOLEAN DEFAULT false,
  scraping_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default stores
INSERT INTO stores (name, slug, website_url, api_available) VALUES
  ('Best Buy', 'bestbuy', 'https://www.bestbuy.com', true),
  ('Walmart', 'walmart', 'https://www.walmart.com', true),
  ('Amazon', 'amazon', 'https://www.amazon.com', true),
  ('Newegg', 'newegg', 'https://www.newegg.com', false),
  ('Dell', 'dell', 'https://www.dell.com', false),
  ('Lenovo', 'lenovo', 'https://www.lenovo.com', false),
  ('Target', 'target', 'https://www.target.com', false),
  ('B&H Photo', 'bhphoto', 'https://www.bhphotovideo.com', false)
ON CONFLICT (slug) DO NOTHING;

-- ========================================
-- TABLE: product_prices
-- Stores price information per store
-- ========================================
CREATE TABLE IF NOT EXISTS product_prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
  
  -- Price information
  price DECIMAL(10, 2),
  original_price DECIMAL(10, 2),
  currency VARCHAR(3) DEFAULT 'USD',
  
  -- Availability
  in_stock BOOLEAN DEFAULT true,
  stock_level VARCHAR(50),
  
  -- Delivery information
  delivery_available BOOLEAN DEFAULT true,
  delivery_price DECIMAL(10, 2),
  delivery_eta VARCHAR(100),
  
  pickup_available BOOLEAN DEFAULT false,
  pickup_price DECIMAL(10, 2),
  
  -- Product URL at store
  product_url TEXT,
  
  -- Timestamps
  scraped_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(product_id, store_id)
);

CREATE INDEX IF NOT EXISTS product_prices_product_idx ON product_prices(product_id);
CREATE INDEX IF NOT EXISTS product_prices_store_idx ON product_prices(store_id);
CREATE INDEX IF NOT EXISTS product_prices_price_idx ON product_prices(price);

-- ========================================
-- TABLE: price_history
-- Tracks price changes over time
-- ========================================
CREATE TABLE IF NOT EXISTS price_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
  price DECIMAL(10, 2) NOT NULL,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS price_history_product_idx ON price_history(product_id);
CREATE INDEX IF NOT EXISTS price_history_recorded_idx ON price_history(recorded_at DESC);

-- ========================================
-- TABLE: search_queries
-- Logs user searches for analytics and suggestions
-- ========================================
CREATE TABLE IF NOT EXISTS search_queries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query_text TEXT NOT NULL,
  parsed_filters JSONB,
  result_count INTEGER,
  session_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS search_queries_created_idx ON search_queries(created_at DESC);

-- ========================================
-- TABLE: favorites
-- User's saved products (localStorage alternative for logged users)
-- ========================================
CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id VARCHAR(255) NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(session_id, product_id)
);

CREATE INDEX IF NOT EXISTS favorites_session_idx ON favorites(session_id);

-- ========================================
-- FUNCTIONS & TRIGGERS
-- ========================================

-- Function to update search vector
CREATE OR REPLACE FUNCTION update_product_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector := 
    setweight(to_tsvector('english', COALESCE(NEW.name, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.brand, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(NEW.category, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update search vector
DROP TRIGGER IF EXISTS products_search_vector_update ON products;
CREATE TRIGGER products_search_vector_update
  BEFORE INSERT OR UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_product_search_vector();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for products table
DROP TRIGGER IF EXISTS products_updated_at ON products;
CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- VIEWS FOR COMMON QUERIES
-- ========================================

-- View: Products with best prices
CREATE OR REPLACE VIEW products_with_best_price AS
SELECT 
  p.*,
  MIN(pp.price) as min_price,
  MAX(pp.price) as max_price,
  AVG(pp.price) as avg_price,
  COUNT(DISTINCT pp.store_id) as store_count
FROM products p
LEFT JOIN product_prices pp ON p.id = pp.product_id
WHERE pp.in_stock = true
GROUP BY p.id;

-- View: Product comparison across stores
CREATE OR REPLACE VIEW product_store_comparison AS
SELECT 
  p.id as product_id,
  p.name as product_name,
  s.name as store_name,
  s.slug as store_slug,
  pp.price,
  pp.delivery_price,
  pp.delivery_eta,
  pp.pickup_available,
  pp.pickup_price,
  pp.in_stock,
  pp.product_url,
  pp.scraped_at
FROM products p
JOIN product_prices pp ON p.id = pp.product_id
JOIN stores s ON pp.store_id = s.id
WHERE pp.in_stock = true
ORDER BY pp.price ASC;

-- ========================================
-- SAMPLE DATA (Optional - for testing)
-- ========================================

-- Sample products (uncomment to insert)
/*
INSERT INTO products (external_id, name, category, brand, description, specs) VALUES
  ('LAPTOP001', 'ASUS ROG Strix G16 Gaming Laptop', 'Laptops', 'ASUS', 
   'High-performance gaming laptop with RTX 4070', 
   '{"cpu": "Intel Core i9-13980HX", "gpu": "NVIDIA RTX 4070", "ram": "32GB DDR5", "storage": "1TB SSD", "screen": "16-inch QHD 240Hz"}'::jsonb),
  
  ('LAPTOP002', 'MSI Raider GE78HX Gaming Laptop', 'Laptops', 'MSI',
   'Premium gaming laptop with RTX 4090',
   '{"cpu": "Intel Core i9-13950HX", "gpu": "NVIDIA RTX 4090", "ram": "64GB DDR5", "storage": "2TB SSD", "screen": "17-inch UHD 144Hz"}'::jsonb),
   
  ('PHONE001', 'Samsung Galaxy S24 Ultra', 'Smartphones', 'Samsung',
   'Flagship smartphone with AI features',
   '{"display": "6.8-inch AMOLED", "camera": "200MP", "storage": "512GB", "ram": "12GB"}'::jsonb);
*/
