/**
 * Product Fetcher Service
 * Fetches products from LIVE WEB SCRAPING + Supabase
 * 
 * @author Sparsh Srivastava
 */

const { supabase } = require('../database/connection');
const { scrapeAllStores } = require('./webScraper-v2');

/**
 * Fetch products from web scraping + Supabase
 */
async function fetchProducts(filters = {}) {
  console.log(' Fetching products with filters:', filters);

  try {
    // Build search query from filters
    const searchQuery = buildSearchQuery(filters);
    console.log(` Search query: "${searchQuery}"`);

    // SCRAPE THE WEB FIRST
    const scrapedProducts = await scrapeAllStores(searchQuery);
    
    // Transform scraped products to match our format
    const products = scrapedProducts.map((p, index) => ({
      id: `web-${p.storeSlug}-${index}`,
      name: p.name,
      brand: extractBrand(p.name),
      category: determineCategory(p.name, filters.category),
      image: p.image || 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400',
      description: p.name,
      specs: extractSpecs(p.name),
      prices: [{
        store: p.store,
        storeSlug: p.storeSlug,
        price: p.price,
        originalPrice: p.price * 1.15,
        inStock: p.inStock,
        delivery: { available: true, price: 0, eta: '2-5 days' },
        pickup: { available: false },
        url: p.link
      }]
    }));

    // Also fetch from Supabase and merge
    const dbProducts = await fetchFromSupabase(filters);
    const allProducts = [...products, ...dbProducts];

    console.log(` Total products found: ${allProducts.length} (${products.length} from web, ${dbProducts.length} from database)`);
    return allProducts;

  } catch (error) {
    console.error('Error in fetchProducts:', error);
    // Fallback to database only
    return await fetchFromSupabase(filters);
  }
}

/**
 * Build search query from filters
 */
function buildSearchQuery(filters) {
  const parts = [];
  
  if (filters.keywords && filters.keywords.length > 0) {
    parts.push(...filters.keywords);
  }
  
  if (filters.category) {
    parts.push(filters.category);
  }
  
  if (filters.brand) {
    const brands = Array.isArray(filters.brand) ? filters.brand : [filters.brand];
    parts.push(...brands);
  }
  
  if (filters.specs?.gpu) {
    parts.push(filters.specs.gpu);
  }
  
  if (filters.specs?.cpu) {
    parts.push(filters.specs.cpu);
  }
  
  return parts.join(' ');
}

/**
 * Extract brand from product name
 */
function extractBrand(name) {
  const brands = ['ASUS', 'MSI', 'Lenovo', 'Dell', 'HP', 'Acer', 'Apple', 'Samsung', 'LG', 'Sony', 'Razer'];
  for (const brand of brands) {
    if (name.toUpperCase().includes(brand.toUpperCase())) {
      return brand;
    }
  }
  return 'Unknown';
}

/**
 * Determine category from product name
 */
function determineCategory(name, filterCategory) {
  if (filterCategory) return filterCategory;
  
  const nameLower = name.toLowerCase();
  if (nameLower.includes('laptop') || nameLower.includes('notebook')) return 'laptops';
  if (nameLower.includes('phone') || nameLower.includes('iphone') || nameLower.includes('galaxy')) return 'smartphones';
  if (nameLower.includes('monitor') || nameLower.includes('display')) return 'monitors';
  if (nameLower.includes('headphone') || nameLower.includes('earbuds')) return 'headphones';
  if (nameLower.includes('keyboard')) return 'keyboards';
  if (nameLower.includes('mouse')) return 'mice';
  if (nameLower.includes('tablet') || nameLower.includes('ipad')) return 'tablets';
  
  return 'electronics';
}

/**
 * Extract specs from product name
 */
function extractSpecs(name) {
  const specs = {};
  
  // Extract GPU
  const gpuMatch = name.match(/(RTX|GTX|RX)\s*\d{4}/i);
  if (gpuMatch) specs.gpu = gpuMatch[0];
  
  // Extract CPU
  const cpuMatch = name.match(/(Intel|AMD|Ryzen|Core)\s*(i\d|Ryzen\s*\d)/i);
  if (cpuMatch) specs.cpu = cpuMatch[0];
  
  // Extract RAM
  const ramMatch = name.match(/(\d+)\s*GB\s*(RAM|DDR\d)/i);
  if (ramMatch) specs.ram = ramMatch[0];
  
  // Extract Storage
  const storageMatch = name.match(/(\d+)\s*(GB|TB)\s*(SSD|HDD)/i);
  if (storageMatch) specs.storage = storageMatch[0];
  
  return specs;
}

/**
 * Fetch from Supabase database (fallback)
 */
async function fetchFromSupabase(filters) {
  try {
    let query = supabase.from('products').select('*');

    // Apply filters
    if (filters.maxPrice) query = query.lte('price', filters.maxPrice);
    if (filters.minPrice) query = query.gte('price', filters.minPrice);
    if (filters.specs?.gpu) query = query.ilike('gpu', `%${filters.specs.gpu}%`);
    if (filters.specs?.cpu) query = query.ilike('cpu', `%${filters.specs.cpu}%`);

    const { data, error } = await query;

    if (error) {
      console.error(' Supabase error:', error);
      return [];
    }

    // Transform to match expected format
    return data.map(p => ({
      id: p.id,
      name: p.title,
      brand: p.brand,
      category: 'laptops',
      image: p.image_url || 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400',
      description: p.description || `${p.brand} laptop with ${p.gpu} GPU and ${p.cpu} CPU`,
      specs: {
        cpu: p.cpu,
        gpu: p.gpu,
        ram: '32GB DDR5',
        storage: '1TB SSD'
      },
      prices: [{
        store: p.store,
        storeSlug: p.store.toLowerCase().replace(/\s+/g, ''),
        price: parseFloat(p.price),
        originalPrice: parseFloat(p.price) * 1.2,
        inStock: true,
        delivery: { available: true, price: 0, eta: '2-3 days' },
        pickup: { available: true, price: 0 },
        url: p.link || '#'
      }]
    }));
  } catch (error) {
    console.error('Error fetching from Supabase:', error);
    return [];
  }
}

module.exports = {
  fetchProducts
};
