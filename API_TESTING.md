# 🧪 API Testing Guide - ShopWise AI

Test all endpoints to ensure everything works correctly.

---

## 🚀 Prerequisites

Make sure the backend server is running:
```bash
cd server
npm run dev
```

Server should be running at: `http://localhost:3001`

---

## 1️⃣ Health Check

### Test Server Status

**Endpoint**: `GET /health`

```bash
curl http://localhost:3001/health
```

**Expected Response**:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 123.45
}
```

---

## 2️⃣ Search API

### Test Product Search

**Endpoint**: `POST /api/search`

```bash
curl -X POST http://localhost:3001/api/search \
  -H "Content-Type: application/json" \
  -d '{"query": "gaming laptops with RTX 4070"}'
```

**Expected Response**:
```json
{
  "success": true,
  "query": "gaming laptops with RTX 4070",
  "filters": {
    "category": "laptops",
    "specs": {
      "gpu": "RTX 4070"
    },
    "keywords": ["gaming", "laptops", "rtx", "4070"]
  },
  "results": [
    {
      "id": "demo-1",
      "name": "ASUS ROG Strix G16 Gaming Laptop",
      "brand": "ASUS",
      "category": "laptops",
      "image": "...",
      "specs": {
        "cpu": "Intel Core i9-13980HX",
        "gpu": "NVIDIA RTX 4070",
        "ram": "32GB DDR5"
      },
      "priceRange": {
        "min": 2249.99,
        "max": 2299.99
      },
      "bestDeal": {
        "store": "Amazon",
        "price": 2249.99
      },
      "prices": [...]
    }
  ],
  "count": 1
}
```

### Test Different Queries

```bash
# Budget phones
curl -X POST http://localhost:3001/api/search \
  -H "Content-Type: application/json" \
  -d '{"query": "smartphones under $500"}'

# Monitors
curl -X POST http://localhost:3001/api/search \
  -H "Content-Type: application/json" \
  -d '{"query": "4K monitors for photo editing"}'

# Specific brand
curl -X POST http://localhost:3001/api/search \
  -H "Content-Type: application/json" \
  -d '{"query": "Dell laptops with 32GB RAM"}'
```

---

## 3️⃣ Products API

### Get Product Details

**Endpoint**: `GET /api/products/:id`

```bash
curl http://localhost:3001/api/products/demo-1
```

**Expected Response**:
```json
{
  "success": true,
  "product": {
    "id": "demo-1",
    "name": "ASUS ROG Strix G16 Gaming Laptop",
    "brand": "ASUS",
    "category": "laptops",
    "image": "...",
    "description": "High-performance gaming laptop...",
    "specs": {...},
    "features": [...],
    "prices": [...]
  }
}
```

### Get Similar Products

**Endpoint**: `GET /api/products/:id/similar`

```bash
curl http://localhost:3001/api/products/demo-1/similar
```

---

## 4️⃣ Stores API

### Get All Stores

**Endpoint**: `GET /api/stores`

```bash
curl http://localhost:3001/api/stores
```

**Expected Response**:
```json
{
  "success": true,
  "stores": [
    {
      "id": 1,
      "name": "Best Buy",
      "slug": "bestbuy",
      "url": "https://www.bestbuy.com"
    },
    ...
  ]
}
```

### Get Store Details

**Endpoint**: `GET /api/stores/:slug`

```bash
curl http://localhost:3001/api/stores/bestbuy
```

---

## 5️⃣ Suggestions API

### Get Query Suggestions

**Endpoint**: `GET /api/suggestions?q=gaming`

```bash
curl http://localhost:3001/api/suggestions?q=gaming
```

**Expected Response**:
```json
{
  "success": true,
  "suggestions": [
    "gaming laptops with RTX 5090 under $3000",
    "gaming chairs under $300",
    "gaming mice under $100"
  ]
}
```

### Get Default Suggestions

```bash
curl http://localhost:3001/api/suggestions
```

---

## 6️⃣ Favorites API

### Get User Favorites

**Endpoint**: `GET /api/favorites`

```bash
curl http://localhost:3001/api/favorites \
  -H "X-Session-Id: test-session-123"
```

### Add to Favorites

**Endpoint**: `POST /api/favorites`

```bash
curl -X POST http://localhost:3001/api/favorites \
  -H "Content-Type: application/json" \
  -H "X-Session-Id: test-session-123" \
  -d '{"productId": "demo-1"}'
```

### Remove from Favorites

**Endpoint**: `DELETE /api/favorites/:productId`

```bash
curl -X DELETE http://localhost:3001/api/favorites/demo-1 \
  -H "X-Session-Id: test-session-123"
```

---

## 7️⃣ Price History API

### Get Price History

**Endpoint**: `GET /api/price-history/:productId`

```bash
curl http://localhost:3001/api/price-history/demo-1
```

**Expected Response**:
```json
{
  "success": true,
  "history": [
    {
      "date": "2024-01-01",
      "price": 2299.99
    },
    {
      "date": "2024-01-02",
      "price": 2279.99
    },
    ...
  ]
}
```

### Get Custom Date Range

```bash
curl "http://localhost:3001/api/price-history/demo-1?days=7"
```

---

## 8️⃣ Search History

### Get Search History

**Endpoint**: `GET /api/search/history`

```bash
curl http://localhost:3001/api/search/history
```

---

## 🧪 Using Postman

### Import Collection

Create a new collection in Postman with these requests:

1. **Health Check**
   - Method: GET
   - URL: `{{baseUrl}}/health`

2. **Search Products**
   - Method: POST
   - URL: `{{baseUrl}}/api/search`
   - Body (JSON):
     ```json
     {
       "query": "gaming laptops with RTX 4070"
     }
     ```

3. **Get Product**
   - Method: GET
   - URL: `{{baseUrl}}/api/products/demo-1`

4. **Get Stores**
   - Method: GET
   - URL: `{{baseUrl}}/api/stores`

5. **Get Suggestions**
   - Method: GET
   - URL: `{{baseUrl}}/api/suggestions?q=gaming`

6. **Add Favorite**
   - Method: POST
   - URL: `{{baseUrl}}/api/favorites`
   - Headers: `X-Session-Id: test-123`
   - Body (JSON):
     ```json
     {
       "productId": "demo-1"
     }
     ```

7. **Get Price History**
   - Method: GET
   - URL: `{{baseUrl}}/api/price-history/demo-1`

**Environment Variables**:
- `baseUrl`: `http://localhost:3001`

---

## 🔍 Testing Frontend Integration

### Test in Browser Console

Open http://localhost:5173 and run in browser console:

```javascript
// Test search
fetch('http://localhost:3001/api/search', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ query: 'gaming laptops' })
})
  .then(r => r.json())
  .then(console.log)

// Test suggestions
fetch('http://localhost:3001/api/suggestions')
  .then(r => r.json())
  .then(console.log)

// Test stores
fetch('http://localhost:3001/api/stores')
  .then(r => r.json())
  .then(console.log)
```

---

## ⚠️ Error Testing

### Test Invalid Requests

**Empty Query**:
```bash
curl -X POST http://localhost:3001/api/search \
  -H "Content-Type: application/json" \
  -d '{"query": ""}'
```

Expected: `400 Bad Request`

**Invalid Product ID**:
```bash
curl http://localhost:3001/api/products/invalid-id
```

Expected: `200 OK` (returns mock data for now)

**Missing Body**:
```bash
curl -X POST http://localhost:3001/api/search \
  -H "Content-Type: application/json"
```

Expected: `400 Bad Request`

---

## 📊 Performance Testing

### Test Response Times

```bash
# Using time command (Unix/Mac)
time curl -X POST http://localhost:3001/api/search \
  -H "Content-Type: application/json" \
  -d '{"query": "laptops"}'

# Should be < 500ms
```

### Test Cache

```bash
# First request (no cache)
time curl -X POST http://localhost:3001/api/search \
  -H "Content-Type: application/json" \
  -d '{"query": "gaming laptops"}'

# Second request (cached - should be faster)
time curl -X POST http://localhost:3001/api/search \
  -H "Content-Type: application/json" \
  -d '{"query": "gaming laptops"}'
```

---

## 🔒 Rate Limit Testing

### Test Rate Limiting

Run this script to test rate limits:

```bash
#!/bin/bash
for i in {1..110}; do
  echo "Request $i"
  curl -s http://localhost:3001/api/search \
    -X POST \
    -H "Content-Type: application/json" \
    -d '{"query": "test"}' \
    -w "\nStatus: %{http_code}\n"
done
```

Expected: After 100 requests, you should see `429 Too Many Requests`

---

## ✅ Checklist

Test each endpoint and mark complete:

### Health & Basic
- [ ] `GET /health` returns 200
- [ ] Server starts without errors
- [ ] CORS headers present

### Search
- [ ] `POST /api/search` with valid query works
- [ ] Returns filtered results
- [ ] Empty query returns 400
- [ ] Cache works on repeat queries

### Products
- [ ] `GET /api/products/:id` returns product
- [ ] `GET /api/products/:id/similar` returns similar items

### Stores
- [ ] `GET /api/stores` returns all stores
- [ ] `GET /api/stores/:slug` returns store details

### Suggestions
- [ ] `GET /api/suggestions` returns suggestions
- [ ] Query param filters suggestions

### Favorites
- [ ] `GET /api/favorites` returns user favorites
- [ ] `POST /api/favorites` adds favorite
- [ ] `DELETE /api/favorites/:id` removes favorite
- [ ] Session ID works correctly

### Price History
- [ ] `GET /api/price-history/:id` returns history
- [ ] Days parameter works

---

## 🐛 Common Issues

### Issue: Connection Refused
**Solution**: Make sure server is running on port 3001

### Issue: CORS Error
**Solution**: Check `CLIENT_URL` in server `.env`

### Issue: Empty Response
**Solution**: Check server logs for errors

### Issue: Timeout
**Solution**: Increase timeout in client config

---

## 📝 Test Results Log

Document your test results:

| Endpoint | Method | Status | Response Time | Notes |
|----------|--------|--------|---------------|-------|
| /health | GET | ✅ 200 | 5ms | Working |
| /api/search | POST | ✅ 200 | 450ms | Returns 1 result |
| /api/products/:id | GET | ✅ 200 | 12ms | Mock data |
| /api/stores | GET | ✅ 200 | 8ms | 8 stores |
| /api/suggestions | GET | ✅ 200 | 10ms | 5 suggestions |
| /api/favorites | GET | ✅ 200 | 5ms | Empty array |
| /api/favorites | POST | ✅ 200 | 8ms | Added successfully |
| /api/price-history/:id | GET | ✅ 200 | 15ms | 30 days data |

---

## 🎉 All Tests Passing?

Congratulations! Your API is working correctly! 🚀

Next steps:
1. Test frontend integration
2. Try with real OpenAI API key
3. Deploy to production
4. Share your project!

---

**Happy Testing!** 🧪✨
