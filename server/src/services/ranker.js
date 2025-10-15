/**
 * Result Ranker Service
 * Intelligently sorts and ranks product search results
 * 
 * @author Sparsh Srivastava
 */

/**
 * Calculate relevance score for a product based on filters
 */
function calculateRelevanceScore(product, filters) {
  let score = 100; // Base score

  // Category match (high importance)
  if (filters.category && product.category === filters.category) {
    score += 50;
  }

  // Brand match
  if (filters.brand) {
    const brands = Array.isArray(filters.brand) ? filters.brand : [filters.brand];
    if (brands.some(b => product.brand.toLowerCase().includes(b.toLowerCase()))) {
      score += 30;
    }
  }

  // Specs match (GPU, CPU, RAM, etc.)
  if (filters.specs) {
    let specMatches = 0;
    const totalSpecs = Object.keys(filters.specs).length;

    for (const [key, value] of Object.entries(filters.specs)) {
      if (product.specs[key] && 
          product.specs[key].toLowerCase().includes(value.toLowerCase())) {
        specMatches++;
      }
    }

    // Add score based on spec match percentage
    score += (specMatches / totalSpecs) * 40;
  }

  // Keywords match
  if (filters.keywords && filters.keywords.length > 0) {
    const searchText = `${product.name} ${product.description} ${Object.values(product.specs).join(' ')}`.toLowerCase();
    const matchedKeywords = filters.keywords.filter(kw => 
      searchText.includes(kw.toLowerCase())
    );
    score += (matchedKeywords.length / filters.keywords.length) * 20;
  }

  // Price competitiveness
  const minPrice = Math.min(...product.prices.map(p => p.price));
  if (filters.maxPrice) {
    const priceRatio = minPrice / filters.maxPrice;
    if (priceRatio <= 0.7) {
      score += 20; // Great deal
    } else if (priceRatio <= 0.9) {
      score += 10; // Good price
    }
  }

  // Availability bonus
  const inStockCount = product.prices.filter(p => p.inStock).length;
  score += inStockCount * 5;

  // Store count (more options = better)
  score += product.prices.length * 3;

  return Math.round(score);
}

/**
 * Calculate best value score (price to performance ratio)
 */
function calculateValueScore(product) {
  const minPrice = Math.min(...product.prices.map(p => p.price));
  
  // Simple heuristic based on specs
  let performanceScore = 0;

  if (product.specs.gpu) {
    if (product.specs.gpu.includes('4090')) performanceScore += 100;
    else if (product.specs.gpu.includes('4080')) performanceScore += 90;
    else if (product.specs.gpu.includes('4070')) performanceScore += 80;
    else if (product.specs.gpu.includes('4060')) performanceScore += 70;
  }

  if (product.specs.ram) {
    const ramGB = parseInt(product.specs.ram);
    performanceScore += ramGB;
  }

  if (product.specs.storage) {
    if (product.specs.storage.includes('2TB')) performanceScore += 20;
    else if (product.specs.storage.includes('1TB')) performanceScore += 10;
  }

  // Value = performance per dollar (higher is better)
  return performanceScore / (minPrice / 1000);
}

/**
 * Main ranking function
 */
function rankResults(products, filters) {
  console.log(`🎯 Ranking ${products.length} products`);

  // Calculate scores for each product
  const scoredProducts = products.map(product => {
    const relevanceScore = calculateRelevanceScore(product, filters);
    const valueScore = calculateValueScore(product);
    const minPrice = Math.min(...product.prices.map(p => p.price));
    const maxPrice = Math.max(...product.prices.map(p => p.price));
    const avgPrice = product.prices.reduce((sum, p) => sum + p.price, 0) / product.prices.length;
    const bestDeal = product.prices.reduce((best, current) => 
      current.price < best.price ? current : best
    );

    return {
      ...product,
      _score: {
        relevance: relevanceScore,
        value: Math.round(valueScore * 100) / 100
      },
      priceRange: {
        min: Math.round(minPrice * 100) / 100,
        max: Math.round(maxPrice * 100) / 100,
        avg: Math.round(avgPrice * 100) / 100
      },
      bestDeal: {
        store: bestDeal.store,
        storeSlug: bestDeal.storeSlug,
        price: bestDeal.price,
        savings: bestDeal.originalPrice ? 
          Math.round((bestDeal.originalPrice - bestDeal.price) * 100) / 100 : 0
      }
    };
  });

  // Sort by relevance score (descending)
  scoredProducts.sort((a, b) => b._score.relevance - a._score.relevance);

  console.log(`✅ Ranked products by relevance`);

  return scoredProducts;
}

/**
 * Sort products by different criteria
 */
function sortProducts(products, sortBy = 'relevance') {
  const sorted = [...products];

  switch (sortBy) {
    case 'price-low':
      sorted.sort((a, b) => a.priceRange.min - b.priceRange.min);
      break;
    
    case 'price-high':
      sorted.sort((a, b) => b.priceRange.min - a.priceRange.min);
      break;
    
    case 'value':
      sorted.sort((a, b) => b._score.value - a._score.value);
      break;
    
    case 'stores':
      sorted.sort((a, b) => b.prices.length - a.prices.length);
      break;
    
    case 'relevance':
    default:
      sorted.sort((a, b) => b._score.relevance - a._score.relevance);
  }

  return sorted;
}

module.exports = {
  rankResults,
  sortProducts
};
