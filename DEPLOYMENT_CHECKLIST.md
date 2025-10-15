# ✅ COMPLETE DEPLOYMENT CHECKLIST

## 🎯 Goal
Get your ShopWise AI fully working on Vercel by deploying the backend to Railway.

---

## 📝 Prerequisites
- [x] GitHub account
- [x] Vercel account (you already have this)
- [ ] Railway account (sign up at https://railway.app)

---

## 🚀 STEP-BY-STEP DEPLOYMENT

### **PART 1: Push Code to GitHub** (5 minutes)

1. **Open PowerShell in your project folder**:
   ```powershell
   cd c:\Users\spars\Desktop\Success_plan\shopwise-ai
   ```

2. **Initialize Git**:
   ```powershell
   git init
   git add .
   git commit -m "Initial commit - ShopWise AI with web scraping"
   ```

3. **Create GitHub repository**:
   - Go to https://github.com/new
   - Name: `shopwise-ai`
   - Make it Public
   - **DO NOT** add README, .gitignore, or license (we already have them)
   - Click "Create repository"

4. **Push to GitHub**:
   ```powershell
   git remote add origin https://github.com/YOUR-USERNAME/shopwise-ai.git
   git branch -M main
   git push -u origin main
   ```

---

### **PART 2: Deploy Backend to Railway** (5 minutes)

1. **Go to Railway**:
   - Visit: https://railway.app
   - Click "Start a New Project"
   - Sign in with GitHub

2. **Create New Project**:
   - Click "Deploy from GitHub repo"
   - Select `shopwise-ai`
   - Railway will start building automatically

3. **Configure Root Directory**:
   - Click on your deployed service
   - Go to Settings tab
   - Under "Build", set Root Directory to: `server`
   - Click "Redeploy"

4. **Add Environment Variables**:
   - Go to Variables tab
   - Click "Raw Editor"
   - Paste this:
   ```
   NODE_ENV=production
   PORT=3001
   SUPABASE_URL=https://wvriootpijtiazlojzcx.supabase.co
   SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind2cmlvb3RwaWp0aWF6bG9qemN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0NjI0ODQsImV4cCI6MjA3NjAzODQ4NH0.TpwPn-s5bmnmpNO_qgyf1o8El-gBOM67l8KxUGqvqMI
   ```
   - Click "Deploy"

5. **Generate Public URL**:
   - Go to Settings → Networking
   - Click "Generate Domain"
   - Copy your URL (like: `shopwise-server-production.up.railway.app`)
   - **SAVE THIS URL!** You'll need it next.

---

### **PART 3: Update Vercel** (3 minutes)

1. **Add Environment Variable**:
   - Go to https://vercel.com/dashboard
   - Select your `shopwise-ai` project
   - Settings → Environment Variables
   - Add:
     - Name: `VITE_API_URL`
     - Value: `https://YOUR-RAILWAY-URL.railway.app` (paste from Railway)
     - Select: Production, Preview, Development
   - Click Save

2. **Redeploy**:
   - Go to Deployments tab
   - Click ⋯ on latest deployment
   - Click "Redeploy"
   - Wait ~2 minutes for build

---

### **PART 4: Test Your Deployment** (2 minutes)

1. **Test Backend**:
   ```
   Visit: https://YOUR-RAILWAY-URL.railway.app/api/health
   Should show: {"status":"healthy"}
   ```

2. **Test Frontend**:
   ```
   Visit: https://shopwise-ai.vercel.app
   Search: "gaming laptops RTX 5090"
   Should show: Products from Amazon + your database!
   ```

---

## 🎉 SUCCESS CRITERIA

When everything works, you should see:
- ✅ Frontend loads at shopwise-ai.vercel.app
- ✅ Search returns products (not errors)
- ✅ Products show from Amazon (16+)
- ✅ Products show from Supabase (2)
- ✅ Product cards have images and prices
- ✅ "Compare Stores" button works
- ✅ No CORS errors in browser console

---

## 🐛 TROUBLESHOOTING

### "404 Not Found" on Vercel
- Frontend deployed but backend URL is wrong
- Check Vercel env vars have correct Railway URL

### "CORS Error" in console
- Railway deployment failed or URL is incorrect
- Check Railway logs for errors

### "No products found"
- Web scraping might be blocked
- Check Railway logs for scraping errors
- Amazon should always work (16 products)

### Railway build fails
- Check build logs in Railway dashboard
- Verify `server/package.json` exists
- Make sure root directory is set to `server`

---

## 📞 NEED HELP?

### Check Railway Logs:
1. Go to Railway dashboard
2. Click your service
3. Click "View Logs"
4. Look for errors

### Check Vercel Logs:
1. Go to Vercel dashboard
2. Click your project
3. Go to Deployments
4. Click on latest deployment
5. Check "Build Logs" and "Function Logs"

### Test Locally First:
```powershell
# Backend
cd server
npm start
# Should run on port 3001

# Frontend (in new terminal)
cd client
npm run dev
# Should run on port 5173
```

If localhost works but production doesn't, it's a deployment configuration issue.

---

## 💡 ALTERNATIVE: Quick Test Without Railway

Want to see if it works on Vercel first?

1. Update `client/src/services/api.js`:
   ```javascript
   const API_URL = 'http://localhost:3001' // Use your backend
   ```

2. Keep your local backend running
3. Deploy only frontend to Vercel
4. Test if frontend works with local backend

This proves your frontend is fine, then you can deploy backend to Railway.

---

## 🎯 ESTIMATED TIME

- GitHub setup: 5 minutes
- Railway deployment: 5 minutes
- Vercel configuration: 3 minutes
- Testing: 2 minutes
- **Total: ~15 minutes**

---

**Ready? Start with PART 1 above!** 🚀
