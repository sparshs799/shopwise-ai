# 🔍 ShopWise AI - Code Analysis & Knowledge Base

**Generated on:** October 14, 2025  
**Analyzed by:** GitHub Copilot  
**Project Owner:** Sparsh Srivastava

---

## 📋 Project Overview

**ShopWise AI** is an intelligent shopping aggregator that uses AI to parse natural language queries and compare products across multiple retailers (Best Buy, Walmart, Amazon, Newegg, Dell, Lenovo).

### Tech Stack
- **Frontend:** React 18 + Vite + Tailwind CSS + Framer Motion
- **Backend:** Node.js + Express
- **Database:** PostgreSQL/Supabase
- **AI:** OpenAI GPT-4 / Anthropic Claude
- **Libraries:** Axios, Recharts, Lucide Icons

---

## 🏗️ Architecture Analysis

### Frontend Structure (`/client`)
```
src/
├── App.jsx                    # Main app component with state management
├── main.jsx                   # React entry point
├── components/
│   ├── chat/                  # Chat interface for search
│   ├── filters/               # Filter sidebar
│   ├── layout/                # Header and layout components
│   ├── products/              # Product cards, comparison, price history
│   └── ui/                    # Reusable UI components
├── hooks/
│   └── useLocalStorage.js     # Custom hook for persisting favorites
└── services/
    └── api.js                 # API client for backend communication
```

### Backend Structure (`/server`)
```
src/
├── index.js                   # Express server setup
├── database/
│   ├── connection.js          # PostgreSQL connection
│   └── schema.sql             # Database schema
├── routes/
│   ├── search.js              # Main search endpoint
│   ├── products.js            # Product CRUD operations
│   ├── stores.js              # Store information
│   ├── suggestions.js         # Search suggestions
│   ├── favorites.js           # User favorites
│   └── priceHistory.js        # Price tracking
└── services/
    ├── aiParser.js            # AI-powered query parsing
    ├── productFetcher.js      # Multi-store product aggregation
    └── ranker.js              # Result ranking algorithm
```

### Database Schema
- **products** - Normalized product information with full-text search
- **stores** - Retailer information (8 stores configured)
- **product_prices** - Current prices per store
- **price_history** - Historical price tracking
- **search_queries** - Analytics and query logging
- **favorites** - User saved products

---

## 🎯 Current Features

### ✅ Implemented
1. **AI Query Parser** - Natural language → structured filters
2. **Multi-Store Aggregation** - 6+ retailers
3. **Smart Ranking** - Relevance, price, value scoring
4. **Price History** - Charts with Recharts
5. **Favorites System** - LocalStorage persistence
6. **Dark Mode UI** - Bolt.new inspired design
7. **Responsive Design** - Mobile-friendly
8. **Caching** - 1-hour TTL with node-cache
9. **Rate Limiting** - 100 req/15min per IP
10. **Demo Mode** - Works without API keys

### 🔄 Partially Implemented
- Real store APIs (currently using demo data)
- Web scraping (Playwright configured but not active)
- Database queries (schema ready, routes use mocks)
- User authentication (session-based favorites only)

---

## 🚀 Improvement Recommendations

### Priority 1: Critical Improvements

#### 1.1 Database Integration
**Current State:** Routes return mock data  
**Required:** Connect to actual PostgreSQL/Supabase

**Implementation:**
```javascript
// In routes/search.js - Add database logging
const { query } = require('../database/connection');

// Log search query
await query(
  'INSERT INTO search_queries (query_text, parsed_filters, result_count) VALUES ($1, $2, $3)',
  [searchQuery, JSON.stringify(filters), results.length]
);
```

#### 1.2 Product Caching System
**Current State:** In-memory cache (lost on restart)  
**Required:** Database-backed caching with TTL

**Benefits:**
- Persistent caching across restarts
- Shared cache in multi-instance deployments
- Better cache invalidation strategies

#### 1.3 Error Handling & Logging
**Current State:** Basic console.log  
**Required:** Structured logging with Winston/Pino

**Add:**
```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

### Priority 2: Feature Enhancements

#### 2.1 User Authentication
**Add:**
- JWT-based authentication
- User accounts with saved searches
- Price drop alerts via email/SMS
- Persistent favorites across devices

#### 2.2 Advanced Filtering
**Add to Frontend:**
- Price range slider
- Brand multiselect
- Spec filters (RAM, Storage, GPU)
- Sort by: savings, rating, delivery speed
- Store preference selection

#### 2.3 Price Alerts System
**Implementation:**
```sql
CREATE TABLE price_alerts (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  product_id UUID REFERENCES products(id),
  target_price DECIMAL(10, 2),
  notified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### 2.4 Real-time Store Integration
**Priority Order:**
1. Best Buy API (official API available)
2. Walmart API (official API available)
3. Amazon Product Advertising API
4. Newegg API
5. Web scraping for others (Dell, Lenovo)

#### 2.5 Enhanced AI Features
**Add:**
- Product comparison suggestions
- "Similar products" recommendations
- Natural language follow-up questions
- Price prediction based on history
- Deal alerts ("This is 20% below average")

### Priority 3: Performance & Optimization

#### 3.1 Frontend Optimizations
```javascript
// Add React.lazy for code splitting
const ChatInterface = lazy(() => import('./components/chat/ChatInterface'));
const ProductResults = lazy(() => import('./components/products/ProductResults'));

// Add virtualization for large product lists
import { FixedSizeList } from 'react-window';
```

#### 3.2 Backend Optimizations
- Add Redis for session and cache management
- Implement background job queue (Bull/BullMQ) for scraping
- Add CDN caching for product images
- Optimize database queries with proper indexes

#### 3.3 API Response Time Improvements
- Parallel fetching from stores (Promise.all)
- Stream results as they come in (Server-Sent Events)
- Implement progressive loading

### Priority 4: DevOps & Monitoring

#### 4.1 Monitoring
**Add:**
- Application Performance Monitoring (APM)
- Error tracking (Sentry)
- Analytics (search patterns, popular products)
- Database query performance monitoring

#### 4.2 Testing
**Add:**
```json
// package.json
"scripts": {
  "test": "jest",
  "test:e2e": "playwright test",
  "test:coverage": "jest --coverage"
}
```

**Create:**
- Unit tests for services (aiParser, ranker)
- Integration tests for API routes
- E2E tests for critical user flows
- Load testing for concurrent searches

#### 4.3 CI/CD Pipeline
**Add:**
- GitHub Actions workflow
- Automated testing on PR
- Deployment to Vercel (frontend) + Railway/Render (backend)
- Environment-based configurations

---

## 🔧 Technical Debt

### Code Quality Issues
1. **Magic Numbers:** Hard-coded values in ranker.js scoring
2. **Error Messages:** Generic error responses
3. **Type Safety:** No TypeScript (consider migration)
4. **API Documentation:** Missing OpenAPI/Swagger docs
5. **Environment Variables:** No .env.example file

### Security Concerns
1. **API Keys:** Ensure proper .env handling
2. **Rate Limiting:** Add per-user rate limits
3. **Input Validation:** Add Joi/Zod schema validation
4. **SQL Injection:** Use parameterized queries (already done)
5. **XSS Protection:** Sanitize user inputs

### Performance Bottlenecks
1. **No pagination:** All results returned at once
2. **No lazy loading:** All product images load immediately
3. **No query debouncing:** Search triggers on every keystroke
4. **Unoptimized images:** No WebP/compression

---

## 📊 Metrics to Track

### Business Metrics
- Total searches per day
- Average products per search
- Click-through rate to stores
- User retention (returning visitors)
- Most searched categories
- Peak usage times

### Technical Metrics
- API response time (p50, p95, p99)
- Cache hit rate
- Database query performance
- Error rate by endpoint
- AI parsing accuracy
- Product fetching success rate

---

## 🎨 UI/UX Improvements

### Immediate Wins
1. **Loading States:** Better skeleton loaders
2. **Empty States:** More engaging illustrations
3. **Micro-interactions:** Hover effects, transitions
4. **Accessibility:** ARIA labels, keyboard navigation
5. **Toast Notifications:** Success/error feedback

### Future Enhancements
1. **Product Comparison Table:** Side-by-side comparison
2. **Price History Graph:** Interactive chart with zoom
3. **Store Availability Map:** Show nearby pickup locations
4. **Product Image Gallery:** Multiple product images
5. **Review Integration:** Aggregate reviews from stores

---

## 🔐 Environment Variables Checklist

### Required
```env
# Server
PORT=3001
NODE_ENV=production

# Database
DATABASE_URL=postgresql://...
# OR
SUPABASE_URL=https://...
SUPABASE_KEY=...

# AI Service (at least one)
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
```

### Optional (for better results)
```env
# Store APIs
BESTBUY_API_KEY=...
WALMART_API_KEY=...
RAPIDAPI_KEY=...

# Monitoring
SENTRY_DSN=...

# Redis (for caching)
REDIS_URL=...
```

---

## 📚 Learning Resources

### For Team Members
- **React Best Practices:** https://react.dev
- **Express Security:** https://expressjs.com/en/advanced/best-practice-security.html
- **PostgreSQL Performance:** https://wiki.postgresql.org/wiki/Performance_Optimization
- **AI Prompt Engineering:** OpenAI Cookbook

### Documentation to Create
1. API Documentation (OpenAPI)
2. Setup Guide (detailed .env setup)
3. Contributing Guide
4. Architecture Decision Records (ADRs)
5. Deployment Guide

---

## 🎯 Next Sprint Recommendations

### Week 1-2: Database & Infrastructure
- [ ] Connect to PostgreSQL/Supabase
- [ ] Implement database-backed caching
- [ ] Add structured logging
- [ ] Create .env.example

### Week 3-4: Real Store Integration
- [ ] Integrate Best Buy API
- [ ] Integrate Walmart API
- [ ] Add error handling for failed fetches
- [ ] Implement retry logic

### Week 5-6: User Features
- [ ] Add user authentication
- [ ] Implement price alerts
- [ ] Add advanced filtering UI
- [ ] Create user dashboard

### Week 7-8: Polish & Launch
- [ ] Add comprehensive testing
- [ ] Performance optimization
- [ ] SEO improvements
- [ ] Launch monitoring

---

## 💡 Innovation Ideas

### AI Enhancements
1. **Visual Search:** Upload product image to find deals
2. **Voice Search:** "Hey ShopWise, find me..."
3. **Smart Bundles:** "People buying this also bought..."
4. **Price Prediction:** ML model to predict future prices
5. **Personalized Recommendations:** User behavior analysis

### Gamification
1. **Deal Hunter Badge:** Found 10 deals >30% off
2. **Price Tracker Pro:** Set 5 price alerts
3. **Smart Shopper:** Saved $500 through the app
4. **Leaderboard:** Top deal finders

### Social Features
1. **Share Deals:** Generate shareable deal links
2. **Deal Comments:** Community discussions
3. **User Reviews:** Rate stores and products
4. **Wishlist Sharing:** Share gift ideas

---

## 🏆 Success Criteria

### MVP Success (Month 1-3)
- [ ] 1,000+ searches/day
- [ ] 100+ active users
- [ ] <2s average search time
- [ ] 95%+ uptime

### Growth Phase (Month 4-6)
- [ ] 10,000+ searches/day
- [ ] 1,000+ active users
- [ ] 50+ price alerts set
- [ ] 5+ store integrations

### Scale Phase (Month 7-12)
- [ ] 100,000+ searches/day
- [ ] 10,000+ registered users
- [ ] $10,000+ in affiliate revenue
- [ ] Mobile app launch

---

## 📞 Support & Maintenance

### Regular Tasks
- **Daily:** Monitor error logs, check API status
- **Weekly:** Review top searches, update demo products
- **Monthly:** Database cleanup, performance review
- **Quarterly:** Security audit, dependency updates

### Alerts to Set Up
- API errors > 5% of requests
- Response time > 5 seconds
- Database connection failures
- AI API quota approaching limit
- Server CPU/memory > 80%

---

*This document should be updated as the project evolves. Last reviewed: October 14, 2025*
