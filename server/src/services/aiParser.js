/**
 * AI-Powered Query Parser
 * Converts natural language queries into structured search filters
 * Supports both OpenAI and Anthropic Claude
 * 
 * @author Sparsh Srivastava
 */

const OpenAI = require('openai');
const Anthropic = require('@anthropic-ai/sdk');

// Initialize AI clients
let openai = null;
let anthropic = null;

if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

if (process.env.ANTHROPIC_API_KEY) {
  anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
}

/**
 * System prompt for the AI to understand shopping queries
 */
const SYSTEM_PROMPT = `You are an expert shopping query parser for ShopWise AI. 
Your job is to convert natural language shopping queries into structured JSON filters.

Extract the following information:
- category: product category (laptops, smartphones, monitors, headphones, etc.)
- brand: brand name(s) if mentioned
- minPrice: minimum price (numeric)
- maxPrice: maximum price (numeric)
- specs: specific technical specifications mentioned (cpu, gpu, ram, storage, screen, etc.)
- features: general features (wireless, noise-cancellation, RGB, etc.)
- keywords: important search keywords

Return ONLY valid JSON, no explanations. Example:

User: "gaming laptops with RTX 5090 under $3000"
Response:
{
  "category": "laptops",
  "maxPrice": 3000,
  "specs": {
    "gpu": "RTX 5090"
  },
  "keywords": ["gaming", "laptop", "RTX 5090"],
  "features": ["gaming"]
}

User: "wireless headphones with noise cancellation under $200"
Response:
{
  "category": "headphones",
  "maxPrice": 200,
  "features": ["wireless", "noise cancellation"],
  "keywords": ["wireless", "headphones", "noise cancellation"]
}`;

/**
 * Parse natural language query using OpenAI
 */
async function parseWithOpenAI(query) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: query }
      ],
      temperature: 0.3,
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content;
    return JSON.parse(content);
  } catch (error) {
    console.error('OpenAI parsing error:', error);
    throw error;
  }
}

/**
 * Parse natural language query using Anthropic Claude
 */
async function parseWithClaude(query) {
  try {
    const message = await anthropic.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [
        { role: 'user', content: query }
      ]
    });

    const content = message.content[0].text;
    // Extract JSON from response (Claude might add explanation)
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error('No JSON found in response');
  } catch (error) {
    console.error('Claude parsing error:', error);
    throw error;
  }
}

/**
 * Fallback parser using simple regex and keyword matching
 * Used when AI APIs are not available
 */
function parseWithFallback(query) {
  const filters = {
    keywords: []
  };

  const lowerQuery = query.toLowerCase();

  // Extract price range
  const priceMatch = lowerQuery.match(/under\s+\$?(\d+(?:,\d{3})*(?:\.\d{2})?)/i) ||
                    lowerQuery.match(/below\s+\$?(\d+(?:,\d{3})*(?:\.\d{2})?)/i) ||
                    lowerQuery.match(/less than\s+\$?(\d+(?:,\d{3})*(?:\.\d{2})?)/i);
  
  if (priceMatch) {
    filters.maxPrice = parseFloat(priceMatch[1].replace(/,/g, ''));
  }

  const minPriceMatch = lowerQuery.match(/above\s+\$?(\d+(?:,\d{3})*(?:\.\d{2})?)/i) ||
                        lowerQuery.match(/over\s+\$?(\d+(?:,\d{3})*(?:\.\d{2})?)/i);
  
  if (minPriceMatch) {
    filters.minPrice = parseFloat(minPriceMatch[1].replace(/,/g, ''));
  }

  // Detect categories
  const categories = {
    'laptops': ['laptop', 'notebook', 'portable computer'],
    'smartphones': ['smartphone', 'phone', 'mobile', 'iphone', 'android'],
    'monitors': ['monitor', 'display', 'screen'],
    'headphones': ['headphones', 'headset', 'earbuds', 'earphones'],
    'keyboards': ['keyboard', 'mechanical keyboard'],
    'mice': ['mouse', 'gaming mouse'],
    'tablets': ['tablet', 'ipad'],
    'smartwatches': ['smartwatch', 'smart watch', 'watch'],
    'cameras': ['camera', 'dslr', 'mirrorless']
  };

  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some(kw => lowerQuery.includes(kw))) {
      filters.category = category;
      break;
    }
  }

  // Detect brands
  const brands = ['apple', 'samsung', 'dell', 'hp', 'lenovo', 'asus', 'msi', 
                  'acer', 'sony', 'lg', 'microsoft', 'google', 'nvidia', 'amd', 'intel'];
  
  const detectedBrands = brands.filter(brand => lowerQuery.includes(brand));
  if (detectedBrands.length > 0) {
    filters.brand = detectedBrands;
  }

  // Extract GPU specs
  const gpuMatch = lowerQuery.match(/(rtx|gtx|rx)\s*(\d{4})/i);
  if (gpuMatch) {
    filters.specs = filters.specs || {};
    filters.specs.gpu = gpuMatch[0].toUpperCase();
  }

  // Extract RAM
  const ramMatch = lowerQuery.match(/(\d+)\s*gb\s*(ram|memory)/i);
  if (ramMatch) {
    filters.specs = filters.specs || {};
    filters.specs.ram = `${ramMatch[1]}GB`;
  }

  // Extract storage
  const storageMatch = lowerQuery.match(/(\d+)\s*(gb|tb)\s*(ssd|storage|hard drive)/i);
  if (storageMatch) {
    filters.specs = filters.specs || {};
    filters.specs.storage = `${storageMatch[1]}${storageMatch[2].toUpperCase()}`;
  }

  // Features detection
  const features = [];
  if (lowerQuery.includes('gaming')) features.push('gaming');
  if (lowerQuery.includes('wireless')) features.push('wireless');
  if (lowerQuery.includes('noise cancel')) features.push('noise cancellation');
  if (lowerQuery.includes('rgb')) features.push('RGB');
  if (lowerQuery.includes('mechanical')) features.push('mechanical');
  if (lowerQuery.includes('4k') || lowerQuery.includes('uhd')) features.push('4K');
  
  if (features.length > 0) {
    filters.features = features;
  }

  // Extract keywords (all significant words)
  const words = query.toLowerCase().split(/\s+/);
  const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'with', 'for', 'under', 'above', 'below'];
  filters.keywords = words.filter(word => 
    word.length > 2 && 
    !stopWords.includes(word) && 
    !/^\d+$/.test(word)
  );

  return filters;
}

/**
 * Main parsing function - tries AI services first, falls back to regex
 */
async function parseQuery(query) {
  console.log(`🔍 Parsing query: "${query}"`);

  try {
    // Try OpenAI first
    if (openai) {
      const result = await parseWithOpenAI(query);
      console.log('✅ Parsed with OpenAI:', result);
      return result;
    }

    // Try Claude if OpenAI not available
    if (anthropic) {
      const result = await parseWithClaude(query);
      console.log('✅ Parsed with Claude:', result);
      return result;
    }

    // Fallback to regex parsing
    console.log('⚠️  Using fallback parser (no AI API configured)');
    const result = parseWithFallback(query);
    console.log('✅ Parsed with fallback:', result);
    return result;

  } catch (error) {
    console.error('Error parsing query, using fallback:', error);
    return parseWithFallback(query);
  }
}

/**
 * Get smart query suggestions based on popular searches
 */
function getQuerySuggestions(partialQuery = '') {
  const suggestions = [
    'gaming laptops with RTX 5090 under $3000',
    'best budget smartphones under $500',
    '4K monitors 27 inch for photo editing',
    'wireless headphones with noise cancellation',
    'mechanical keyboards with RGB under $150',
    'gaming chairs under $300',
    'ultrawide monitors for programming',
    'laptops for data science with 32GB RAM',
    'best webcams for streaming under $200',
    'portable SSDs 2TB for backup',
    'ergonomic mouse for productivity',
    'standing desks with electric adjustment',
    'iPad for note-taking and drawing',
    'budget Android phones with good camera',
    'gaming mice under $100'
  ];

  if (!partialQuery) {
    return suggestions.slice(0, 5);
  }

  const lower = partialQuery.toLowerCase();
  return suggestions
    .filter(s => s.toLowerCase().includes(lower))
    .slice(0, 5);
}

module.exports = {
  parseQuery,
  getQuerySuggestions
};
