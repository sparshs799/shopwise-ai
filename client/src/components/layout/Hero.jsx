/**
 * Hero Component - Beautiful Landing Section
 * Inspired by Bolt's clean design
 */

import { motion } from 'framer-motion'
import { Search, Sparkles, TrendingUp, Zap } from 'lucide-react'

export default function Hero({ onSearch }) {
  const suggestions = [
    { text: 'Gaming laptops RTX 5090', icon: '🎮' },
    { text: '4K monitors', icon: '🖥️' },
    { text: 'Gaming peripherals', icon: '⌨️' }
  ]

  const handleSuggestionClick = (text) => {
    onSearch(text)
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    const searchInput = e.target.elements.search.value
    if (searchInput.trim()) {
      onSearch(searchInput)
    }
  }

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-12">
      <div className="max-w-4xl w-full">
        {/* Main Hero Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          {/* Logo/Brand */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-3 mb-6"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
              <Sparkles className="w-9 h-9 text-white" strokeWidth={2.5} />
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 dark:from-white dark:via-indigo-200 dark:to-purple-200 bg-clip-text text-transparent"
          >
            ShopWise AI
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-3"
          >
            Smart Shopping Comparison
          </motion.p>

          {/* Features badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex items-center justify-center gap-4 mb-12"
          >
            <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 rounded-full">
              <TrendingUp className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">AI-Powered</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 dark:bg-purple-900/30 rounded-full">
              <Zap className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Real-time</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Search Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4 text-center">
            Find Your Perfect Product
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-center mb-8">
            Compare prices across stores with AI-powered search
          </p>

          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="relative max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                name="search"
                placeholder="Try: gaming laptops with RTX 5090 under $3000..."
                className="w-full pl-12 pr-4 py-4 text-lg rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400 transition-all shadow-lg hover:shadow-xl"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-xl transition-all shadow-md hover:shadow-lg"
              >
                Search
              </button>
            </div>
          </form>

          {/* Quick Suggestions */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {suggestions.map((suggestion, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + index * 0.1, duration: 0.3 }}
                onClick={() => handleSuggestionClick(suggestion.text)}
                className="group px-4 py-2.5 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-400 rounded-xl transition-all hover:shadow-lg hover:scale-105 active:scale-95"
              >
                <span className="flex items-center gap-2">
                  <span className="text-lg">{suggestion.icon}</span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                    {suggestion.text}
                  </span>
                </span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Start Your Search Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="text-center"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Start Your Search
          </h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
            Try searching for "gaming laptops with RTX 5090 under $3000" or click one of the suggestions above
          </p>
        </motion.div>
      </div>
    </div>
  )
}
