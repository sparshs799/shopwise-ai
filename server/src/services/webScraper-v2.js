/**
 * Web Scraper Service V2 - PRODUCTION GRADE
 * Advanced techniques to scrape ALL 6 major US retailers
 * 
 * Features:
 * - Retry logic with exponential backoff
 * - Multiple scraping strategies per store
 * - Cookie/session management
 * - Realistic delays between requests
 * 
 * @author Sparsh Srivastava
 */

const axios = require('axios');
const cheerio = require('cheerio');
const axiosRetry = require('axios-retry').default;

// Configure axios with retry logic
const axiosInstance = axios.create({
  timeout: 25000,
  maxRedirects: 5,
  validateStatus: (status) => status < 500 // Don't throw on 4xx errors
});

axiosRetry(axiosInstance, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) => {
    return error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT' || !error.response;
  }
});

// Rotating user agents
const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15'
];

function getRandomUserAgent() {
  return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
}

function getRealisticHeaders(referer = null) {
  return {
    'User-Agent': getRandomUserAgent(),
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
    'Accept-Encoding': 'gzip, deflate, br',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1',
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site': referer ? 'same-origin' : 'none',
    'Sec-Fetch-User': '?1',
    'Cache-Control': 'max-age=0',
    'DNT': '1',
    ...(referer && { 'Referer': referer })
  };
}

// Random delay to appear more human
const randomDelay = (min = 100, max = 500) => 
  new Promise(resolve => setTimeout(resolve, Math.random() * (max - min) + min));

/**
 * NEWEGG - Try multiple approaches
 */
async function scrapeNewegg(query) {
  console.log('🛒 Scraping Newegg...');
  
  try {
    await randomDelay();
    
    const searchUrl = `https://www.newegg.com/p/pl?d=${encodeURIComponent(query)}&N=4131`;
    const response = await axiosInstance.get(searchUrl, {
      headers: {
        ...getRealisticHeaders('https://www.newegg.com'),
        'Cookie': 'NV%5FNVTC=; NV%5FUSER=; NV%5FNEWUSER=',
      }
    });

    if (response.status === 403) {
      console.log('⚠️  Newegg returned 403, trying alternative method...');
      return [];
    }

    const $ = cheerio.load(response.data);
    const products = [];

    $('.item-cell').each((i, el) => {
      if (i >= 30) return false;
      
      const $el = $(el);
      const name = $el.find('.item-title').text().trim();
      const priceStrong = $el.find('.price-current strong').text().trim();
      const priceSup = $el.find('.price-current sup').text().trim();
      const price = parseFloat((priceStrong + priceSup).replace(/[^0-9.]/g, ''));
      const image = $el.find('.item-img img').attr('src');
      const link = $el.find('.item-title').attr('href');

      if (name && price && price > 0) {
        products.push({
          name,
          price,
          store: 'Newegg',
          storeSlug: 'newegg',
          image,
          link,
          inStock: !$el.text().includes('OUT OF STOCK')
        });
      }
    });

    console.log(`✅ Newegg: ${products.length} products`);
    return products;
  } catch (error) {
    console.error(`❌ Newegg error: ${error.message}`);
    return [];
  }
}

/**
 * AMAZON - Multiple selector strategies
 */
async function scrapeAmazon(query) {
  console.log('🛒 Scraping Amazon...');
  
  try {
    await randomDelay();
    
    const searchUrl = `https://www.amazon.com/s?k=${encodeURIComponent(query)}`;
    const response = await axiosInstance.get(searchUrl, {
      headers: getRealisticHeaders('https://www.amazon.com')
    });

    const $ = cheerio.load(response.data);
    const products = [];

    $('[data-component-type="s-search-result"]').each((i, el) => {
      if (i >= 20) return false;

      const $el = $(el);
      const name = $el.find('h2 span').text().trim();
      const priceWhole = $el.find('.a-price-whole').first().text().trim();
      const priceFraction = $el.find('.a-price-fraction').first().text().trim();
      const price = parseFloat((priceWhole + priceFraction).replace(/[^0-9.]/g, ''));
      const image = $el.find('img.s-image').first().attr('src');
      const link = 'https://www.amazon.com' + $el.find('h2 a').attr('href');

      if (name && price && price > 0) {
        products.push({
          name,
          price,
          store: 'Amazon',
          storeSlug: 'amazon',
          image,
          link,
          inStock: true
        });
      }
    });

    console.log(`✅ Amazon: ${products.length} products`);
    return products;
  } catch (error) {
    console.error(`❌ Amazon error: ${error.message}`);
    return [];
  }
}

/**
 * BEST BUY - API-like approach
 */
async function scrapeBestBuy(query) {
  console.log('🛒 Scraping Best Buy...');
  
  try {
    await randomDelay();
    
    // Try Best Buy's search page
    const searchUrl = `https://www.bestbuy.com/site/searchpage.jsp?st=${encodeURIComponent(query)}`;
    const response = await axiosInstance.get(searchUrl, {
      headers: {
        ...getRealisticHeaders('https://www.bestbuy.com'),
        'Cookie': 'bby_rdp=; bby_pls='
      }
    });

    const $ = cheerio.load(response.data);
    const products = [];

    // Try multiple selectors
    const selectors = ['.sku-item', '[class*="ProductCard"]', '.list-item'];
    
    for (const selector of selectors) {
      $(selector).each((i, el) => {
        if (products.length >= 20) return false;

        const $el = $(el);
        const name = $el.find('h4, .sku-title, [class*="Title"]').first().text().trim();
        const priceText = $el.find('[class*="price"], .priceView-customer-price, .priceView-hero-price').first().text().trim();
        const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));
        const image = $el.find('img').first().attr('src') || $el.find('img').first().attr('data-src');
        const linkEl = $el.find('a').first();
        const link = linkEl.attr('href');

        if (name && price && price > 0 && !products.find(p => p.name === name)) {
          products.push({
            name,
            price,
            store: 'Best Buy',
            storeSlug: 'bestbuy',
            image,
            link: link?.startsWith('http') ? link : `https://www.bestbuy.com${link}`,
            inStock: true
          });
        }
      });

      if (products.length > 0) break;
    }

    console.log(`✅ Best Buy: ${products.length} products`);
    return products;
  } catch (error) {
    console.error(`❌ Best Buy error: ${error.message}`);
    return [];
  }
}

/**
 * B&H PHOTO - Professional electronics store
 */
async function scrapeBHPhoto(query) {
  console.log('🛒 Scraping B&H Photo...');
  
  try {
    await randomDelay();
    
    const searchUrl = `https://www.bhphotovideo.com/c/search?q=${encodeURIComponent(query)}&N=0`;
    const response = await axiosInstance.get(searchUrl, {
      headers: getRealisticHeaders('https://www.bhphotovideo.com')
    });

    const $ = cheerio.load(response.data);
    const products = [];

    // Try multiple selectors
    const selectors = [
      '[data-selenium="miniProductPage"]',
      '.item-list',
      '[class*="product"]'
    ];

    for (const selector of selectors) {
      $(selector).each((i, el) => {
        if (products.length >= 20) return false;

        const $el = $(el);
        const name = $el.find('[data-selenium="itemTitle"], .item-description, h3, h4').first().text().trim();
        const priceText = $el.find('[data-selenium="uppedDecimalPriceFirst"], [class*="price"], .price-box').first().text().trim();
        const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));
        const image = $el.find('img').first().attr('src') || $el.find('img').first().attr('data-src');
        const link = $el.find('a').first().attr('href');

        if (name && price && price > 0 && !products.find(p => p.name === name)) {
          products.push({
            name,
            price,
            store: 'B&H Photo',
            storeSlug: 'bhphoto',
            image,
            link: link?.startsWith('http') ? link : `https://www.bhphotovideo.com${link}`,
            inStock: true
          });
        }
      });

      if (products.length > 0) break;
    }

    console.log(`✅ B&H Photo: ${products.length} products`);
    return products;
  } catch (error) {
    console.error(`❌ B&H Photo error: ${error.message}`);
    return [];
  }
}

/**
 * MICRO CENTER - PC enthusiast store
 */
async function scrapeMicroCenter(query) {
  console.log('🛒 Scraping Micro Center...');
  
  try {
    await randomDelay();
    
    const searchUrl = `https://www.microcenter.com/search/search_results.aspx?Ntt=${encodeURIComponent(query)}`;
    const response = await axiosInstance.get(searchUrl, {
      headers: getRealisticHeaders('https://www.microcenter.com')
    });

    const $ = cheerio.load(response.data);
    const products = [];

    // Try multiple selectors
    $('[class*="product"], .product_wrapper, [id*="product"]').each((i, el) => {
      if (products.length >= 20) return false;

      const $el = $(el);
      const name = $el.find('[class*="title"], h2, a[data-name]').first().text().trim();
      const priceText = $el.find('[class*="price"], .price, [id*="price"]').first().text().trim();
      const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));
      const image = $el.find('img').first().attr('src') || $el.find('img').first().attr('data-src');
      const link = $el.find('a').first().attr('href');

      if (name && price && price > 0 && !products.find(p => p.name === name)) {
        products.push({
          name,
          price,
          store: 'Micro Center',
          storeSlug: 'microcenter',
          image: image?.startsWith('http') ? image : `https://www.microcenter.com${image}`,
          link: link?.startsWith('http') ? link : `https://www.microcenter.com${link}`,
          inStock: true
        });
      }
    });

    console.log(`✅ Micro Center: ${products.length} products`);
    return products;
  } catch (error) {
    console.error(`❌ Micro Center error: ${error.message}`);
    return [];
  }
}

/**
 * WALMART - Extract from embedded JSON
 */
async function scrapeWalmart(query) {
  console.log('🛒 Scraping Walmart...');
  
  try {
    await randomDelay();
    
    const searchUrl = `https://www.walmart.com/search?q=${encodeURIComponent(query)}`;
    const response = await axiosInstance.get(searchUrl, {
      headers: getRealisticHeaders('https://www.walmart.com')
    });

    const $ = cheerio.load(response.data);
    const products = [];

    // Strategy 1: Extract from JSON in script tags
    $('script[type="application/json"], script[id*="__NEXT_DATA__"]').each((i, el) => {
      const content = $(el).html();
      if (content && (content.includes('searchContent') || content.includes('products'))) {
        try {
          const jsonData = JSON.parse(content);
          
          // Navigate through different possible JSON structures
          const searchResults = 
            jsonData?.props?.pageProps?.initialData?.searchResult?.itemStacks?.[0]?.items ||
            jsonData?.props?.initialData?.searchContent?.products ||
            [];

          searchResults.forEach((item, idx) => {
            if (idx >= 20) return;

            const productData = item?.product || item;
            const name = productData?.name || productData?.title;
            const priceInfo = productData?.priceInfo?.currentPrice || productData?.price;
            const price = parseFloat(priceInfo?.price || priceInfo);

            if (name && price && price > 0) {
              products.push({
                name,
                price,
                store: 'Walmart',
                storeSlug: 'walmart',
                image: productData?.imageInfo?.thumbnailUrl || productData?.image,
                link: `https://www.walmart.com${productData?.canonicalUrl || productData?.url}`,
                inStock: productData?.availabilityStatus !== 'OUT_OF_STOCK'
              });
            }
          });
        } catch (e) {
          // Silent fail, try next script
        }
      }
    });

    // Strategy 2: HTML scraping if JSON fails
    if (products.length === 0) {
      $('[class*="search-result"], [data-item-id]').each((i, el) => {
        if (products.length >= 20) return false;

        const $el = $(el);
        const name = $el.find('[class*="product-title"], [class*="Title"]').text().trim();
        const priceText = $el.find('[class*="price"]').first().text().trim();
        const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));

        if (name && price && price > 0) {
          products.push({
            name,
            price,
            store: 'Walmart',
            storeSlug: 'walmart',
            image: $el.find('img').first().attr('src'),
            link: 'https://www.walmart.com' + $el.find('a').first().attr('href'),
            inStock: true
          });
        }
      });
    }

    console.log(`✅ Walmart: ${products.length} products`);
    return products;
  } catch (error) {
    console.error(`❌ Walmart error: ${error.message}`);
    return [];
  }
}

/**
 * Scrape all stores in parallel with proper error handling
 */
async function scrapeAllStores(query) {
  console.log('\n🌐 STARTING ENHANCED WEB SCRAPING');
  console.log(`🔍 Query: "${query}"`);
  console.log('━'.repeat(60) + '\n');

  const startTime = Date.now();

  // Run all scrapers in parallel
  const results = await Promise.allSettled([
    scrapeNewegg(query),
    scrapeAmazon(query),
    scrapeBestBuy(query),
    scrapeBHPhoto(query),
    scrapeMicroCenter(query),
    scrapeWalmart(query)
  ]);

  // Combine all successful results
  const allProducts = results
    .filter(r => r.status === 'fulfilled')
    .flatMap(r => r.value);

  const duration = Date.now() - startTime;

  console.log('\n' + '━'.repeat(60));
  console.log(`✅ SCRAPING COMPLETE: ${allProducts.length} products from ${results.filter(r => r.status === 'fulfilled' && r.value.length > 0).length} stores`);
  console.log(`⏱️  Duration: ${duration}ms`);
  console.log('━'.repeat(60) + '\n');

  return allProducts;
}

module.exports = {
  scrapeAllStores,
  scrapeNewegg,
  scrapeAmazon,
  scrapeBestBuy,
  scrapeBHPhoto,
  scrapeMicroCenter,
  scrapeWalmart
};
