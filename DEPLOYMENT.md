# 🚀 DEPLOYMENT GUIDE - ShopWise AI

Complete step-by-step guide to deploy ShopWise AI to production.

---

## 📋 Prerequisites

Before deploying, make sure you have:

- ✅ Node.js 18+ installed
- ✅ Git installed and repository created
- ✅ Accounts created on:
  - [Vercel](https://vercel.com) (Frontend)
  - [Railway](https://railway.app) or [Render](https://render.com) (Backend)
  - [Supabase](https://supabase.com) (Database)
  - [OpenAI](https://platform.openai.com) (AI Service)

---

## 1️⃣ Database Setup (Supabase)

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Enter project details:
   - Name: `shopwise-ai`
   - Database Password: (save this!)
   - Region: Choose closest to your users
4. Click "Create new project"

### Step 2: Run Database Schema

1. Once project is created, go to **SQL Editor** in the sidebar
2. Click "New query"
3. Copy the entire contents of `server/src/database/schema.sql`
4. Paste and click "Run"
5. Verify tables are created in **Table Editor**

### Step 3: Get Connection Details

1. Go to **Project Settings** > **Database**
2. Copy these values:
   - `SUPABASE_URL`: Your project URL (e.g., https://xxx.supabase.co)
   - `SUPABASE_KEY`: Your anon/public key
3. Save these for later

---

## 2️⃣ Backend Deployment (Railway)

### Option A: Deploy to Railway (Recommended)

#### Step 1: Install Railway CLI

```bash
npm install -g @railway/cli
```

#### Step 2: Login and Initialize

```bash
cd server
railway login
railway init
```

#### Step 3: Add Environment Variables

In Railway dashboard, go to your project and add these variables:

```env
NODE_ENV=production
PORT=3001

# Database (from Supabase)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-supabase-anon-key

# AI Service
OPENAI_API_KEY=sk-proj-your-openai-key

# Optional Store APIs
BESTBUY_API_KEY=your-key-if-available
WALMART_API_KEY=your-key-if-available

# CORS (will update after Vercel deployment)
CLIENT_URL=https://your-app.vercel.app
```

#### Step 4: Deploy

```bash
railway up
```

#### Step 5: Get Your Backend URL

After deployment, Railway will give you a URL like:
`https://shopwise-server-production.up.railway.app`

**Save this URL - you'll need it for frontend deployment!**

---

### Option B: Deploy to Render

#### Step 1: Connect Repository

1. Go to [render.com](https://render.com)
2. Click "New +" > "Web Service"
3. Connect your GitHub repository
4. Select the `server` directory

#### Step 2: Configure Service

- **Name**: shopwise-api
- **Environment**: Node
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Plan**: Free (or paid for better performance)

#### Step 3: Add Environment Variables

Add the same variables as Railway (see above)

#### Step 4: Deploy

Click "Create Web Service" and wait for deployment.

---

## 3️⃣ Frontend Deployment (Vercel)

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Deploy from Client Directory

```bash
cd client
vercel
```

Follow the prompts:
- Set up and deploy? **Y**
- Which scope? (your account)
- Link to existing project? **N**
- Project name? `shopwise-ai`
- Directory? `./`
- Override settings? **N**

### Step 3: Configure Environment Variables

After first deployment, add environment variable:

```bash
vercel env add VITE_API_URL
```

Enter your backend URL (from Railway/Render):
```
https://shopwise-server-production.up.railway.app
```

### Step 4: Redeploy with Environment Variables

```bash
vercel --prod
```

### Step 5: Update Backend CORS

Go back to Railway/Render and update the `CLIENT_URL` variable with your Vercel URL:
```
CLIENT_URL=https://shopwise-ai.vercel.app
```

---

## 4️⃣ Get API Keys

### OpenAI API Key

1. Go to [platform.openai.com](https://platform.openai.com)
2. Sign up or log in
3. Go to **API Keys** section
4. Click "Create new secret key"
5. Copy the key (starts with `sk-proj-...`)
6. Add $5-10 credit to your account

**Alternative**: Use Anthropic Claude instead:
- Get key from [console.anthropic.com](https://console.anthropic.com)
- Use `ANTHROPIC_API_KEY` instead

### Optional: Store APIs

**Best Buy API**:
- Apply at [developer.bestbuy.com](https://developer.bestbuy.com)
- Free tier available

**Walmart API** (via RapidAPI):
- Go to [rapidapi.com](https://rapidapi.com)
- Search for "Walmart API"
- Subscribe to free tier

---

## 5️⃣ Verify Deployment

### Backend Health Check

Visit: `https://your-backend-url.railway.app/health`

You should see:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 123.45
}
```

### Frontend Check

1. Visit your Vercel URL: `https://shopwise-ai.vercel.app`
2. You should see the ShopWise AI homepage
3. Try a search query: "gaming laptops under $2000"
4. Verify results load correctly

---

## 6️⃣ Custom Domain (Optional)

### For Vercel (Frontend)

1. Go to Vercel dashboard > your project
2. Click **Settings** > **Domains**
3. Add your domain (e.g., `shopwise.ai`)
4. Follow DNS configuration instructions
5. Update `CLIENT_URL` in Railway/Render

### For Railway (Backend)

1. Go to Railway dashboard > your service
2. Click **Settings** > **Domains**
3. Add custom domain
4. Update `VITE_API_URL` in Vercel

---

## 7️⃣ Monitoring & Maintenance

### View Logs

**Vercel**:
```bash
vercel logs
```

**Railway**:
```bash
railway logs
```

**Render**:
- View in dashboard under "Logs" tab

### Database Backups

Supabase automatically creates backups. To manually backup:
1. Go to **Database** > **Backups**
2. Click "Create backup"

---

## 🐛 Troubleshooting

### Issue: "API Request Failed"

**Solution**: Check CORS settings
- Verify `CLIENT_URL` in backend matches your Vercel URL
- Ensure no trailing slashes

### Issue: "Database connection error"

**Solution**: 
- Verify Supabase credentials are correct
- Check if Supabase project is paused (free tier)
- Ensure schema is properly created

### Issue: "AI parsing not working"

**Solution**:
- Verify OpenAI API key is valid
- Check if you have credits in your OpenAI account
- App will fallback to regex parsing if AI fails

### Issue: Frontend shows "Network Error"

**Solution**:
- Check `VITE_API_URL` environment variable in Vercel
- Verify backend is running (check health endpoint)
- Check browser console for CORS errors

---

## 📊 Performance Optimization

### Enable Caching

The app already includes:
- Server-side caching (Node-Cache)
- Browser localStorage for favorites
- Price data cached for 1 hour

### Add CDN for Images

Consider using:
- Cloudinary for product images
- Vercel Image Optimization

### Database Optimization

- Add indexes for frequently queried fields
- Use Supabase connection pooling
- Enable query caching

---

## 🔒 Security Best Practices

1. **Never commit `.env` files**
   - Already in `.gitignore`
   - Use platform environment variables

2. **Rate Limiting**
   - Already implemented in backend
   - Adjust in `server/src/index.js` if needed

3. **API Key Rotation**
   - Rotate OpenAI keys every 90 days
   - Update in Railway/Render dashboard

4. **HTTPS Only**
   - Vercel and Railway use HTTPS by default
   - Never allow HTTP in production

---

## 💰 Cost Estimation

### Free Tier (Good for testing)

- **Vercel**: Free (hobby plan)
- **Railway**: $5 credit/month (usually enough)
- **Supabase**: Free up to 500MB
- **OpenAI**: ~$0.002 per search (pay as you go)

**Total**: ~$5-10/month for moderate usage

### Paid Tier (Production)

- **Vercel Pro**: $20/month
- **Railway Pro**: $20/month
- **Supabase Pro**: $25/month
- **OpenAI**: ~$50/month (500 searches/day)

**Total**: ~$115/month for heavy usage

---

## 🎉 You're Done!

Your ShopWise AI is now live! 🚀

**Share your deployment**:
- Frontend: `https://your-app.vercel.app`
- Backend: `https://your-backend.railway.app`

**Next Steps**:
- Add your own branding
- Integrate real store APIs
- Add user authentication
- Implement price drop alerts

---

## 📞 Need Help?

If you encounter issues:
1. Check the troubleshooting section above
2. Review logs in Vercel/Railway dashboard
3. Ensure all environment variables are set correctly

**Built by Sparsh Srivastava** 🎓
Data Science @ Penn State
