# 🚀 ShopWise AI - Complete Deployment Guide

## 📋 What You Need to Deploy

Your app has **2 parts**:
1. **Frontend (client)** → Already on Vercel ✅
2. **Backend (server)** → Needs to be deployed ❌

## 🎯 Step-by-Step Deployment

### **Step 1: Deploy Backend to Railway** (5 minutes)

1. **Go to**: https://railway.app
2. **Sign up** with GitHub
3. **Click**: "New Project" → "Deploy from GitHub repo"
4. **Select**: Your `shopwise-ai` repository
5. **Root Directory**: Change to `server`
6. **Add Environment Variables**:
   ```
   NODE_ENV=production
   PORT=3001
   SUPABASE_URL=https://wvriootpijtiazlojzcx.supabase.co
   SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind2cmlvb3RwaWp0aWF6bG9qemN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0NjI0ODQsImV4cCI6MjA3NjAzODQ4NH0.TpwPn-s5bmnmpNO_qgyf1o8El-gBOM67l8KxUGqvqMI
   ```
7. **Click**: Deploy
8. **Copy** your Railway URL (e.g., `https://shopwise-api-production.up.railway.app`)

### **Step 2: Update Vercel Frontend**

1. **Go to**: https://vercel.com/dashboard
2. **Select**: Your `shopwise-ai` project
3. **Settings** → **Environment Variables**
4. **Add**:
   ```
   VITE_API_URL=https://YOUR-RAILWAY-URL.railway.app
   ```
5. **Redeploy**: Deployments → Click "Redeploy"

### **Step 3: Update vercel.json** (Local)

Replace the Railway URL in your `vercel.json`:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "client/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "https://YOUR-RAILWAY-URL.railway.app/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/client/$1"
    }
  ],
  "env": {
    "VITE_API_URL": "https://YOUR-RAILWAY-URL.railway.app"
  }
}
```

## ⚡ Alternative: Vercel Serverless Functions (Advanced)

If you want everything on Vercel, you'd need to:
1. Convert backend to Vercel serverless functions
2. Split scrapers into separate functions (10s timeout limit)
3. Use Vercel Edge for caching

**This is complex and NOT recommended for web scraping.**

## 🎉 After Deployment

Your app will be live at:
- **Frontend**: https://shopwise-ai.vercel.app
- **Backend**: https://your-app.railway.app
- **Full Stack**: Working together! 🚀

## ⚠️ Important Notes

1. **Railway Free Tier**: 
   - $5 free credits per month
   - Enough for ~100,000 requests
   - Perfect for demos/testing

2. **Web Scraping Limitations**:
   - Some stores may still block (403 errors)
   - Amazon works best
   - Consider using official APIs for production

3. **Environment Variables**:
   - Never commit .env files to Git
   - Always use platform environment variables
   - Supabase keys are already in the deployment steps above

## 🆘 Need Help?

If Railway deployment fails:
1. Check build logs in Railway dashboard
2. Make sure `package.json` has all dependencies
3. Verify environment variables are set correctly

**Alternative Free Hosting**:
- **Render.com** - Similar to Railway
- **Fly.io** - Good for Node.js apps
- **Heroku** - Classic choice (requires credit card)

---

**Built by Sparsh Srivastava** 💜
