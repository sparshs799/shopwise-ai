/**
 * Web Scraper Service - ENHANCED VERSION
 * Real-time scraping of ALL major US electronics retailers
 * 
 * @author Sparsh Srivastava
 */

const axios = require('axios');
const cheerio = require('cheerio');

// Realistic browser headers to bypass anti-bot
const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0'
];

const getHeaders = () => ({
  'User-Agent': USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)],
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
  'Accept-Encoding': 'gzip, deflate, br',
  'Connection': 'keep-alive',
  'Upgrade-Insecure-Requests': '1',
  'Sec-Fetch-Dest': 'document',
  'Sec-Fetch-Mode': 'navigate',
  'Sec-Fetch-Site': 'none',
  'Cache-Control': 'max-age=0'
});

// Scrape Newegg
async function scrapeNewegg(query) {
  console.log(' Scraping Newegg...');
  try {
    const url = `https://www.newegg.com/p/pl?d=${encodeURIComponent(query)}&N=4131`;
    const { data } = await axios.get(url, { headers: getHeaders(), timeout: 20000 });
    const $ = cheerio.load(data);
    const products = [];
    
    $('.item-cell').each((i, el) => {
      if (i >= 30) return false;
      const name = $(el).find('.item-title').text().trim();
      const price = parseFloat(($(el).find('.price-current strong').text() + $(el).find('.price-current sup').text()).replace(/[^0-9.]/g, ''));
      if (name && price > 0) products.push({ name, price, store: 'Newegg', storeSlug: 'newegg', image: $(el).find('img').attr('src'), link: $(el).find('.item-title').attr('href'), inStock: true });
    });
    
    console.log(` Newegg: ${products.length} products`);
    return products;
  } catch (error) {
    console.error(` Newegg error: ${error.message}`);
    return [];
  }
}

// Scrape Amazon
async function scrapeAmazon(query) {
  console.log(' Scraping Amazon...');
  try {
    const url = `https://www.amazon.com/s?k=${encodeURIComponent(query)}`;
    const { data } = await axios.get(url, { headers: getHeaders(), timeout: 20000 });
    const $ = cheerio.load(data);
    const products = [];
    
    $('[data-component-type="s-search-result"]').each((i, el) => {
      if (i >= 20) return false;
      const name = $(el).find('h2 span').text().trim();
      const priceStr = $(el).find('.a-price-whole').first().text() + $(el).find('.a-price-fraction').first().text();
      const price = parseFloat(priceStr.replace(/[^0-9.]/g, ''));
      if (name && price > 0) products.push({ name, price, store: 'Amazon', storeSlug: 'amazon', image: $(el).find('img').first().attr('src'), link: 'https://www.amazon.com' + $(el).find('h2 a').attr('href'), inStock: true });
    });
    
    console.log(` Amazon: ${products.length} products`);
    return products;
  } catch (error) {
    console.error(` Amazon error: ${error.message}`);
    return [];
  }
}

// Scrape Best Buy
async function scrapeBestBuy(query) {
  console.log(' Scraping Best Buy...');
  try {
    const url = `https://www.bestbuy.com/site/searchpage.jsp?st=${encodeURIComponent(query)}`;
    const { data } = await axios.get(url, { headers: getHeaders(), timeout: 20000 });
    const $ = cheerio.load(data);
    const products = [];
    
    $('.sku-item').each((i, el) => {
      if (i >= 20) return false;
      const name = $(el).find('.sku-title').text().trim();
      const price = parseFloat($(el).find('.priceView-customer-price').text().replace(/[^0-9.]/g, ''));
      if (name && price > 0) products.push({ name, price, store: 'Best Buy', storeSlug: 'bestbuy', image: $(el).find('img').first().attr('src'), link: 'https://www.bestbuy.com' + $(el).find('.sku-title a').attr('href'), inStock: true });
    });
    
    console.log(` Best Buy: ${products.length} products`);
    return products;
  } catch (error) {
    console.error(` Best Buy error: ${error.message}`);
    return [];
  }
}

// Scrape B&H Photo
async function scrapeBHPhoto(query) {
  console.log(' Scraping B&H Photo...');
  try {
    const url = `https://www.bhphotovideo.com/c/search?q=${encodeURIComponent(query)}`;
    const { data } = await axios.get(url, { headers: getHeaders(), timeout: 20000 });
    const $ = cheerio.load(data);
    const products = [];
    
    $('[data-selenium="miniProductPage"]').each((i, el) => {
      if (i >= 20) return false;
      const name = $(el).find('[data-selenium="itemTitle"]').text().trim();
      const price = parseFloat($(el).find('[data-selenium="uppedDecimalPriceFirst"]').text().replace(/[^0-9.]/g, ''));
      if (name && price > 0) products.push({ name, price, store: 'B&H Photo', storeSlug: 'bhphoto', image: $(el).find('img').first().attr('src'), link: 'https://www.bhphotovideo.com' + $(el).find('a').first().attr('href'), inStock: true });
    });
    
    console.log(` B&H Photo: ${products.length} products`);
    return products;
  } catch (error) {
    console.error(` B&H Photo error: ${error.message}`);
    return [];
  }
}

// Scrape Micro Center
async function scrapeMicroCenter(query) {
  console.log(' Scraping Micro Center...');
  try {
    const url = `https://www.microcenter.com/search/search_results.aspx?Ntt=${encodeURIComponent(query)}`;
    const { data } = await axios.get(url, { headers: getHeaders(), timeout: 20000 });
    const $ = cheerio.load(data);
    const products = [];
    
    $('.product_wrapper').each((i, el) => {
      if (i >= 20) return false;
      const name = $(el).find('.product-title').text().trim();
      const price = parseFloat($(el).find('.price').text().replace(/[^0-9.]/g, ''));
      const image = $(el).find('img').attr('src');
      const link = $(el).find('a').first().attr('href');
      if (name && price > 0) products.push({ name, price, store: 'Micro Center', storeSlug: 'microcenter', image: image?.startsWith('http') ? image : 'https://www.microcenter.com' + image, link: link?.startsWith('http') ? link : 'https://www.microcenter.com' + link, inStock: true });
    });
    
    console.log(` Micro Center: ${products.length} products`);
    return products;
  } catch (error) {
    console.error(` Micro Center error: ${error.message}`);
    return [];
  }
}

// Scrape Walmart
async function scrapeWalmart(query) {
  console.log(' Scraping Walmart...');
  try {
    const url = `https://www.walmart.com/search?q=${encodeURIComponent(query)}`;
    const { data } = await axios.get(url, { headers: getHeaders(), timeout: 20000 });
    const $ = cheerio.load(data);
    const products = [];
    
    // Extract from JSON in script tags
    $('script').each((i, el) => {
      const content = $(el).html();
      if (content && content.includes('searchContent') && content.includes('products')) {
        try {
          const match = content.match(/"products":\[(.*?)\]/s);
          if (match) {
            const productsData = JSON.parse('[' + match[1] + ']');
            productsData.forEach((p, idx) => {
              if (idx < 20 && p.name && p.price) {
                products.push({ name: p.name, price: parseFloat(p.price), store: 'Walmart', storeSlug: 'walmart', image: p.image, link: `https://www.walmart.com${p.canonicalUrl}`, inStock: p.availabilityStatus !== 'OUT_OF_STOCK' });
              }
            });
          }
        } catch (e) {}
      }
    });
    
    console.log(` Walmart: ${products.length} products`);
    return products;
  } catch (error) {
    console.error(` Walmart error: ${error.message}`);
    return [];
  }
}

// Scrape all stores in parallel
async function scrapeAllStores(query) {
  console.log('\n STARTING WEB SCRAPING FOR ALL US STORES');
  console.log(` Query: "${query}"`);
  console.log(''.repeat(60) + '\n');
  
  const start = Date.now();
  const results = await Promise.allSettled([
    scrapeNewegg(query),
    scrapeAmazon(query),
    scrapeBestBuy(query),
    scrapeBHPhoto(query),
    scrapeMicroCenter(query),
    scrapeWalmart(query)
  ]);
  
  const allProducts = results
    .filter(r => r.status === 'fulfilled')
    .flatMap(r => r.value);
  
  console.log('\n' + ''.repeat(60));
  console.log(` SCRAPING COMPLETE: ${allProducts.length} products`);
  console.log(`  Duration: ${Date.now() - start}ms`);
  console.log(''.repeat(60) + '\n');
  
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
