# ⚡ QUICK START GUIDE - ShopWise AI

Get up and running in 10 minutes!

---

## 🎯 Prerequisites

Make sure you have these installed:
- ✅ **Node.js 18+** - [Download here](https://nodejs.org/)
- ✅ **Git** - [Download here](https://git-scm.com/)
- ✅ **Code Editor** - VS Code recommended

---

## 📦 Installation

### Step 1: Clone/Navigate to Project

```bash
cd shopwise-ai
```

### Step 2: Install All Dependencies

```bash
# Install root dependencies
npm install

# Install client and server dependencies
npm run install:all
```

This will install:
- Root workspace dependencies
- Client (React) dependencies
- Server (Express) dependencies

---

## 🔧 Configuration

### Step 3: Set Up Environment Variables

#### Backend Configuration

Create `.env` file in `server` folder:

```bash
cd server
cp .env.example .env
```

Edit `server/.env` and add your API keys:

```env
# Server
PORT=3001
NODE_ENV=development

# Database (Optional for demo - works without it)
# SUPABASE_URL=https://your-project.supabase.co
# SUPABASE_KEY=your-supabase-key

# AI Service (Optional - will use fallback parser without it)
# OPENAI_API_KEY=sk-proj-your-openai-key

# CORS
CLIENT_URL=http://localhost:5173
```

**Note**: The app works in demo mode without any API keys! It will use:
- Mock product data (6 demo products)
- Fallback regex parser (no AI needed)
- In-memory caching

#### Frontend Configuration

Create `.env` file in `client` folder:

```bash
cd ../client
cp .env.example .env
```

Edit `client/.env`:

```env
VITE_API_URL=http://localhost:3001
```

---

## 🚀 Running the App

### Option 1: Run Everything at Once (Recommended)

From the root `shopwise-ai` folder:

```bash
npm run dev
```

This starts:
- ✅ Backend server on `http://localhost:3001`
- ✅ Frontend dev server on `http://localhost:5173`

### Option 2: Run Separately

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

---

## 🎉 Open the App

1. Open your browser
2. Go to: **http://localhost:5173**
3. You should see the ShopWise AI homepage!

---

## 🧪 Test the App

Try these example searches:

1. **"gaming laptops with RTX 4070 under $3000"**
2. **"best budget smartphones under $500"**
3. **"4K monitors for photo editing"**

You should see:
- ✅ Product cards with images
- ✅ Multiple store prices
- ✅ "Compare Stores" button
- ✅ Smooth animations

---

## 🐛 Troubleshooting

### Issue: "Port 3001 already in use"

**Solution**: Kill the process or change port in `server/.env`:
```bash
# Windows PowerShell
Stop-Process -Id (Get-NetTCPConnection -LocalPort 3001).OwningProcess -Force

# Change port (in server/.env)
PORT=3002
```

### Issue: "Cannot find module"

**Solution**: Reinstall dependencies:
```bash
rm -rf node_modules client/node_modules server/node_modules
npm run install:all
```

### Issue: Frontend not loading

**Solution**: Check if backend is running:
- Visit http://localhost:3001/health
- Should show: `{"status":"healthy",...}`

### Issue: "API Request Failed"

**Solution**: Check CORS settings:
- Verify `CLIENT_URL` in `server/.env` is `http://localhost:5173`
- Restart the backend server

---

## 📚 Project Structure

```
shopwise-ai/
├── client/              # React frontend
│   ├── src/
│   │   ├── components/  # UI components
│   │   ├── services/    # API calls
│   │   ├── hooks/       # Custom hooks
│   │   ├── styles/      # CSS files
│   │   ├── App.jsx      # Main app
│   │   └── main.jsx     # Entry point
│   └── package.json
│
├── server/              # Express backend
│   ├── src/
│   │   ├── routes/      # API routes
│   │   ├── services/    # Business logic
│   │   ├── database/    # DB connection
│   │   └── index.js     # Server entry
│   └── package.json
│
├── package.json         # Root package
└── README.md           # Main documentation
```

---

## 🎨 Key Features Implemented

### ✅ AI-Powered Search
- Natural language processing
- Fallback regex parser (works without AI API)
- Smart query suggestions

### ✅ Multi-Store Comparison
- Compare prices across 8+ retailers
- Delivery and pickup options
- In-stock availability

### ✅ Beautiful UI
- Bolt.new-inspired chat interface
- Dark mode theme
- Smooth Framer Motion animations
- Responsive design

### ✅ Price Tracking
- 30-day price history charts
- Best deal highlighting
- Savings calculator

### ✅ Favorites System
- Save products (localStorage)
- Persistent across sessions
- Quick access

---

## 🔑 Optional: Add AI Capabilities

### Get OpenAI API Key (Free Trial Available)

1. Go to [platform.openai.com](https://platform.openai.com)
2. Sign up for an account
3. Go to **API Keys** section
4. Click **"Create new secret key"**
5. Copy the key (starts with `sk-proj-...`)
6. Add to `server/.env`:
   ```env
   OPENAI_API_KEY=sk-proj-your-key-here
   ```
7. Restart the backend server

**Benefits**:
- Much better query understanding
- Handles complex queries
- Extracts specs automatically

**Free Tier**: $5 credit (usually enough for 2500+ searches)

---

## 🗄️ Optional: Set Up Database

### Using Supabase (Recommended)

1. Go to [supabase.com](https://supabase.com) and create account
2. Create new project
3. Go to **SQL Editor** and run `server/src/database/schema.sql`
4. Get credentials from **Settings** > **Database**
5. Add to `server/.env`:
   ```env
   SUPABASE_URL=https://xxx.supabase.co
   SUPABASE_KEY=your-anon-key
   ```
6. Restart backend

**Benefits**:
- Real product persistence
- Search history tracking
- Better favorites management
- Production-ready

---

## 📝 Development Workflow

### Making Changes

1. **Frontend changes**: Files in `client/src/` auto-reload
2. **Backend changes**: Server auto-restarts with nodemon
3. **Styling changes**: Tailwind compiles automatically

### Adding Features

1. Check `ENHANCEMENTS.md` for ideas
2. Backend routes: Add to `server/src/routes/`
3. Frontend components: Add to `client/src/components/`
4. API calls: Update `client/src/services/api.js`

---

## 🚢 Ready to Deploy?

See **DEPLOYMENT.md** for complete deployment guide to:
- ✅ Vercel (Frontend)
- ✅ Railway/Render (Backend)
- ✅ Supabase (Database)

Deployment takes ~15 minutes and is mostly free!

---

## 🎓 Learning Resources

### Technologies Used

- **React**: [react.dev](https://react.dev)
- **Tailwind CSS**: [tailwindcss.com](https://tailwindcss.com)
- **Framer Motion**: [framer.com/motion](https://www.framer.com/motion/)
- **Express**: [expressjs.com](https://expressjs.com)
- **OpenAI**: [platform.openai.com/docs](https://platform.openai.com/docs)

### Recommended Tutorials

1. React hooks and state management
2. Tailwind utility classes
3. REST API design
4. Framer Motion animations
5. Natural Language Processing basics

---

## 💡 Tips for Development

### Performance
- Use React DevTools to check renders
- Monitor network tab for API calls
- Check Lighthouse scores

### Code Quality
- Follow existing code style
- Add comments for complex logic
- Keep components small and focused

### Debugging
- Use `console.log` liberally
- Check browser console for errors
- Use VS Code debugger

---

## 🤝 Contributing

Want to improve ShopWise AI?

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

---

## 📞 Need Help?

### Common Issues

1. **Backend not starting**: Check if port 3001 is free
2. **Frontend not loading**: Verify API URL in `.env`
3. **No results showing**: Check backend logs for errors
4. **Styling broken**: Clear browser cache, restart Vite

### Debug Mode

Enable verbose logging in `server/.env`:
```env
NODE_ENV=development
```

Check logs in terminal where server is running.

---

## 🎯 Next Steps

1. ✅ **Test the demo** - Try all features
2. ✅ **Add OpenAI key** - Get better AI parsing
3. ✅ **Customize branding** - Update colors/logo
4. ✅ **Deploy to production** - Share with friends!
5. ✅ **Add new features** - Check ENHANCEMENTS.md

---

## 🌟 Showcase Your Work

This project demonstrates:
- ✅ Full-stack development
- ✅ AI/ML integration
- ✅ Modern UI/UX design
- ✅ API integration
- ✅ Database design
- ✅ Production deployment

**Perfect for your portfolio!** 🎓

Add to:
- GitHub profile
- LinkedIn projects
- Resume
- Portfolio website

---

## 🏆 You're All Set!

Your ShopWise AI is now running locally! 🎉

**Enjoy building and happy coding!** 💻

---

**Built with ❤️ by Sparsh Srivastava**
Data Science @ Penn State

*Questions? Check README.md, DEPLOYMENT.md, or ENHANCEMENTS.md*
