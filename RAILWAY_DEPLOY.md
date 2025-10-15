# 🚂 Deploy Backend to Railway (5 Minutes)

## 📋 Quick Deploy

### Step 1: Sign Up for Railway
1. Go to: https://railway.app
2. Click "Start a New Project"
3. Sign in with GitHub

### Step 2: Deploy Your Server

**Option A: Deploy from GitHub (Recommended)**
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your `shopwise-ai` repository
4. Railway will detect it's a Node.js app

**Option B: Deploy with Railway CLI**
```bash
npm install -g @railway/cli
railway login
cd server
railway init
railway up
```

### Step 3: Configure Environment Variables

In Railway Dashboard → Variables tab, add:

```env
NODE_ENV=production
PORT=3001
SUPABASE_URL=https://wvriootpijtiazlojzcx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind2cmlvb3RwaWp0aWF6bG9qemN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0NjI0ODQsImV4cCI6MjA3NjAzODQ4NH0.TpwPn-s5bmnmpNO_qgyf1o8El-gBOM67l8KxUGqvqMI
```

### Step 4: Set Root Directory

In Railway:
1. Settings → Root Directory
2. Change to: `server`
3. Save changes
4. Click "Redeploy"

### Step 5: Get Your Backend URL

1. After deployment completes
2. Go to Settings → Domains
3. Click "Generate Domain"
4. Copy your URL (e.g., `https://shopwise-server-production.up.railway.app`)

---

## 🔗 Connect to Vercel

### Update Vercel Environment Variable

1. Go to: https://vercel.com/dashboard
2. Select your `shopwise-ai` project
3. Go to Settings → Environment Variables
4. Add new variable:
   ```
   Name: VITE_API_URL
   Value: https://YOUR-RAILWAY-URL.railway.app
   ```
5. Check all environments (Production, Preview, Development)
6. Click Save

### Trigger Vercel Redeploy

**Option 1: From Vercel Dashboard**
1. Go to Deployments tab
2. Click ⋯ on latest deployment
3. Click "Redeploy"

**Option 2: Git Push**
```bash
git add .
git commit -m "Update API URL for Railway backend"
git push origin main
```

---

## ✅ Verify Deployment

### Test Backend
Visit: `https://YOUR-RAILWAY-URL.railway.app/api/health`

Should return:
```json
{
  "status": "healthy",
  "timestamp": "2025-10-15T...",
  "uptime": 123
}
```

### Test Full App
Visit: `https://shopwise-ai.vercel.app`

Search for "gaming laptops" - you should see products!

---

## 🎉 Success!

Your full-stack app is now live:
- ✅ Frontend: Vercel
- ✅ Backend: Railway
- ✅ Database: Supabase
- ✅ Web Scraping: Working!

---

## 🆘 Troubleshooting

### Backend fails to deploy?
- Check Railway build logs
- Verify `server/package.json` has all dependencies
- Make sure `Procfile` exists in server folder

### CORS errors?
- Verify Railway URL is correct in Vercel env vars
- Check Railway logs for "Blocked by CORS" messages
- Environment variables must be set in Railway

### No products showing?
- Check Railway logs for scraping errors
- Verify Supabase credentials are correct
- Test API endpoint directly

---

## 💰 Railway Costs

**Free Tier:**
- $5 free credits per month
- ~500 hours of uptime
- Perfect for demos and testing

**Hobby Plan ($5/month):**
- Unlimited hours
- Better for production use

---

## 📚 Alternative Platforms

If Railway doesn't work, try:
- **Render.com** - Similar to Railway
- **Fly.io** - Good for Node.js
- **Heroku** - Classic (requires credit card)
- **DigitalOcean App Platform** - Reliable

---

**Need help? Check the logs in Railway dashboard or run locally to debug first!**
