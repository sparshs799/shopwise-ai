# 🛍️ ShopWise AI

**Your Intelligent Shopping Companion** - An AI-driven shopping aggregator that helps you find the best deals across multiple retailers.

Built by **Sparsh Srivastava** | Data Science @ Penn State

---

## 🌟 Features

### Core Features
- 🤖 **AI-Powered Search**: Natural language queries like "gaming laptops with RTX 5090 under $3000"
- 🏪 **Multi-Store Aggregation**: Compare prices from BestBuy, Walmart, Amazon, Newegg, Dell, Lenovo
- 💬 **Chat-Style Interface**: Clean, Bolt.new-inspired UI with conversational experience
- 📊 **Smart Comparison**: Side-by-side store comparison with pickup/delivery prices and ETAs
- ⚡ **Real-Time Results**: Fast product fetching with intelligent caching

### Bonus Features
- 📈 **Price History Charts**: Track price trends over time using Recharts
- ⭐ **Favorites System**: Save products for later review
- 🎯 **Auto-Suggestions**: Smart query recommendations
- 🎨 **Dark Mode**: Beautiful dark theme with electric blue accents
- 📱 **Mobile Responsive**: Works perfectly on all devices
- 🔍 **SEO Optimized**: Meta tags and social media previews

---

## 🏗️ Architecture

```
┌─────────────┐
│   User UI   │ (React + Vite + Tailwind CSS)
└──────┬──────┘
       │
       ↓
┌─────────────────────────────────────────┐
│          Query Parser (AI)              │
│    (OpenAI/Claude NLP Processing)       │
└──────┬──────────────────────────────────┘
       │
       ↓
┌─────────────────────────────────────────┐
│       Product Fetcher Service           │
│  (Web Scraping + Public APIs)           │
└──────┬──────────────────────────────────┘
       │
       ↓
┌─────────────────────────────────────────┐
│    PostgreSQL/Supabase Database         │
│  (Caching + Normalization)              │
└──────┬──────────────────────────────────┘
       │
       ↓
┌─────────────────────────────────────────┐
│       Result Ranker & Renderer          │
│  (Smart Sorting + UI Display)           │
└─────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL or Supabase account
- OpenAI API key (for AI query parsing)

### Installation

1. **Clone and install dependencies**
```bash
cd shopwise-ai
npm run install:all
```

2. **Set up environment variables**

Create `.env` file in `/server` directory:
```env
# Server
PORT=3001
NODE_ENV=development

# Database (Supabase or PostgreSQL)
DATABASE_URL=postgresql://user:password@host:5432/shopwise
# OR use Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-supabase-anon-key

# AI Service (OpenAI or Claude)
OPENAI_API_KEY=sk-your-openai-key
# OR
ANTHROPIC_API_KEY=sk-ant-your-claude-key

# Store APIs (Optional - for better data)
BESTBUY_API_KEY=your-bestbuy-key
WALMART_API_KEY=your-walmart-key
RAPIDAPI_KEY=your-rapidapi-key

# CORS
CLIENT_URL=http://localhost:5173
```

Create `.env` file in `/client` directory:
```env
VITE_API_URL=http://localhost:3001
```

3. **Run the development servers**
```bash
# Run both client and server
npm run dev

# Or run separately
npm run dev:client  # Frontend on http://localhost:5173
npm run dev:server  # Backend on http://localhost:3001
```

---

## 📦 Deployment

### Deploy to Vercel (Frontend)

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Deploy client**
```bash
cd client
vercel
```

3. **Configure environment variables in Vercel dashboard**
   - Add `VITE_API_URL` pointing to your backend

### Deploy Backend (Railway/Render/Heroku)

**Option 1: Railway**
```bash
cd server
railway login
railway init
railway up
```

**Option 2: Render**
1. Connect your GitHub repo
2. Create a new Web Service
3. Set build command: `cd server && npm install`
4. Set start command: `cd server && npm start`
5. Add environment variables

### Database Setup (Supabase)

1. Create a new project at [supabase.com](https://supabase.com)
2. Run the schema from `/server/database/schema.sql` in SQL Editor
3. Copy connection string to `DATABASE_URL` or use Supabase client

---

## 🎯 Example Queries

Try these natural language queries:

- "Show me gaming laptops with RTX 5090 under $3000"
- "Best budget smartphones under $500"
- "4K monitors 27 inch for photo editing"
- "Wireless headphones with noise cancellation"
- "Gaming chairs under $300 with lumbar support"
- "Mechanical keyboards with RGB under $150"

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool & dev server
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Recharts** - Price history charts
- **Lucide React** - Modern icon set
- **Axios** - API communication

### Backend
- **Node.js + Express** - Server framework
- **PostgreSQL/Supabase** - Database
- **OpenAI/Claude API** - Natural language processing
- **Cheerio** - Web scraping
- **Playwright** - Dynamic site scraping
- **Node-Cache** - In-memory caching

### DevOps
- **Vercel** - Frontend hosting
- **Railway/Render** - Backend hosting
- **Supabase** - Database & real-time features

---

## 📁 Project Structure

```
shopwise-ai/
├── client/                 # React frontend
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── chat/      # Chat interface
│   │   │   ├── products/  # Product cards & comparison
│   │   │   └── ui/        # Reusable UI components
│   │   ├── services/      # API communication
│   │   ├── hooks/         # Custom React hooks
│   │   ├── utils/         # Helper functions
│   │   ├── styles/        # Global styles
│   │   ├── App.jsx        # Main app component
│   │   └── main.jsx       # Entry point
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── server/                # Express backend
│   ├── src/
│   │   ├── routes/        # API endpoints
│   │   ├── services/      # Business logic
│   │   │   ├── aiParser.js       # NLP query parsing
│   │   │   ├── productFetcher.js # Multi-store fetching
│   │   │   └── ranker.js         # Result sorting
│   │   ├── utils/         # Helper functions
│   │   ├── middleware/    # Express middleware
│   │   └── database/      # DB connection & models
│   ├── index.js           # Server entry point
│   └── package.json
│
├── package.json           # Root package file
└── README.md             # This file
```

---

## 🎨 Design System

### Colors
- **Primary**: Electric Blue (#3B82F6)
- **Background**: Dark Navy (#0F172A)
- **Surface**: Slate (#1E293B)
- **Text Primary**: White (#FFFFFF)
- **Text Secondary**: Gray (#94A3B8)
- **Accent**: Cyan (#06B6D4)
- **Success**: Green (#10B981)
- **Warning**: Amber (#F59E0B)

### Typography
- **Font Family**: Inter (system font fallback)
- **Headings**: Bold, 600-800 weight
- **Body**: Regular, 400 weight

---

## 🔮 Future Enhancements

- [ ] User authentication & profile management
- [ ] Price drop alerts via email/SMS
- [ ] Browser extension for price tracking
- [ ] Product reviews aggregation
- [ ] Wishlist sharing functionality
- [ ] Voice search integration
- [ ] AR product preview
- [ ] Social shopping features
- [ ] Cashback & coupon integration
- [ ] Advanced analytics dashboard

---

## 🤝 Contributing

This is a personal project by Sparsh Srivastava. Feel free to fork and customize!

---

## 📄 License

MIT License - feel free to use this project for learning or your portfolio.

---

## 👨‍💻 About the Developer

**Sparsh Srivastava**
- 🎓 Data Science Major @ Penn State
- 💼 Building production-grade AI applications
- 🔗 [GitHub](https://github.com/sparsh) | [LinkedIn](https://linkedin.com/in/sparsh)

---

## 📞 Support

For questions or issues, please open an issue on GitHub or contact directly.

**Made with ❤️ and lots of ☕**
