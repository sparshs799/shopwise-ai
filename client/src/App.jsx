/**
 * Main App Component
 * Root component with beautiful landing page and search
 * 
 * @author Sparsh Srivastava
 */

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Header from './components/layout/Header'
import Hero from './components/layout/Hero'
import ChatInterface from './components/chat/ChatInterface'
import FilterSidebar from './components/filters/FilterSidebar'
import ProductResults from './components/products/ProductResults'
import EmptyState from './components/ui/EmptyState'
import { searchProducts } from './services/api'
import { useLocalStorage } from './hooks/useLocalStorage'

function App() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [filters, setFilters] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showFilters, setShowFilters] = useState(false)
  const [favorites, setFavorites] = useLocalStorage('shopwise-favorites', [])
  const [sortBy, setSortBy] = useState('relevance')
  const [hasSearched, setHasSearched] = useState(false)

  const handleSearch = async (searchQuery) => {
    if (!searchQuery.trim()) return

    setLoading(true)
    setError(null)
    setQuery(searchQuery)
    setHasSearched(true)

    try {
      const response = await searchProducts(searchQuery)
      setResults(response.results)
      setFilters(response.filters)
    } catch (err) {
      setError(err.message || 'Failed to search products')
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const toggleFavorite = (productId) => {
    setFavorites(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId)
      } else {
        return [...prev, productId]
      }
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-indigo-950">
      <Header />

      <main className="pt-20">
        {/* Show Hero when no search has been performed */}
        {!hasSearched && !loading && (
          <Hero onSearch={handleSearch} />
        )}

        {/* Show Results after search */}
        <AnimatePresence mode="wait">
          {hasSearched && (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6"
            >
              {/* Search Bar for subsequent searches */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4">
                <ChatInterface onSearch={handleSearch} loading={loading} />
              </div>

              {/* Query Summary */}
              {query && (
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Results for: <span className="text-indigo-600 dark:text-indigo-400">{query}</span>
                      </h2>
                      {filters && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {results.length} products found
                          {filters.category && ` in ${filters.category}`}
                          {filters.maxPrice && ` under $${filters.maxPrice}`}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500"
                      >
                        <option value="relevance">Most Relevant</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                        <option value="value">Best Value</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Results */}
              <ProductResults
                products={results}
                loading={loading}
                error={error}
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
                sortBy={sortBy}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}

export default App
