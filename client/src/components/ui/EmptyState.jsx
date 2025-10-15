/**
 * Empty State Component
 * Displayed when no search has been performed
 * 
 * @author Sparsh Srivastava
 */

import { Sparkles, TrendingUp, Zap } from 'lucide-react'
import { motion } from 'framer-motion'

export default function EmptyState({ onSearch }) {
  const exampleQueries = [
    {
      icon: '💻',
      text: 'Gaming laptops with RTX 5090 under $3000',
      category: 'Electronics'
    },
    {
      icon: '📱',
      text: 'Best budget smartphones under $500',
      category: 'Mobile'
    },
    {
      icon: '🖥️',
      text: '4K monitors 27 inch for photo editing',
      category: 'Displays'
    },
    {
      icon: '🎧',
      text: 'Wireless headphones with noise cancellation',
      category: 'Audio'
    }
  ]

  const features = [
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: 'AI-Powered Search',
      description: 'Natural language understanding for precise results'
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: 'Price Tracking',
      description: 'Monitor price history and get the best deals'
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Real-Time Comparison',
      description: 'Compare across 8+ retailers instantly'
    }
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-12 py-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-6"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-cyan-500 shadow-xl shadow-primary-500/20 mb-4">
          <Sparkles className="w-10 h-10 text-white" />
        </div>
        
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Welcome to <span className="gradient-text">ShopWise AI</span>
          </h1>
          <p className="text-lg text-dark-300 max-w-2xl mx-auto">
            Your intelligent shopping companion. Ask anything in natural language and discover the best deals across multiple stores.
          </p>
        </div>
      </motion.div>

      {/* Features Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {features.map((feature, index) => (
          <div
            key={index}
            className="card text-center space-y-3"
          >
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary-500/10 text-primary-400">
              {feature.icon}
            </div>
            <h3 className="font-semibold text-white">{feature.title}</h3>
            <p className="text-sm text-dark-400">{feature.description}</p>
          </div>
        ))}
      </motion.div>

      {/* Example Queries */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        <h2 className="text-xl font-semibold text-white text-center mb-6">
          Try these example searches
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {exampleQueries.map((query, index) => (
            <motion.button
              key={index}
              onClick={() => onSearch(query.text)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="card-hover text-left group"
            >
              <div className="flex items-start gap-3">
                <span className="text-3xl">{query.icon}</span>
                <div className="flex-1">
                  <div className="text-xs text-primary-400 font-medium mb-1">
                    {query.category}
                  </div>
                  <p className="text-white group-hover:text-primary-400 transition-colors">
                    {query.text}
                  </p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-center text-sm text-dark-400"
      >
        <p>Type your query in the chat box below to get started</p>
        <p className="mt-2">Built with ❤️ by Sparsh Srivastava</p>
      </motion.div>
    </div>
  )
}
