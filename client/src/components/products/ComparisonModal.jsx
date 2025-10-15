/**
 * Comparison Modal Component
 * Shows detailed price comparison across all stores
 * 
 * @author Sparsh Srivastava
 */

import { useState } from 'react'
import { X, ExternalLink, TrendingUp, Truck, Store as StoreIcon, Clock } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import PriceHistoryChart from './PriceHistoryChart'

export default function ComparisonModal({ isOpen, onClose, product }) {
  const [showPriceHistory, setShowPriceHistory] = useState(false)

  if (!isOpen) return null

  const { name, image, specs, prices } = product

  // Sort prices by lowest first
  const sortedPrices = [...prices].sort((a, b) => a.price - b.price)

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto custom-scrollbar glass rounded-2xl shadow-2xl"
        >
          {/* Header */}
          <div className="sticky top-0 glass border-b border-dark-700 p-6 flex items-start justify-between">
            <div className="flex gap-4 flex-1">
              <img
                src={image}
                alt={name}
                className="w-20 h-20 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h2 className="text-xl font-bold text-white mb-2">{name}</h2>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(specs).slice(0, 4).map(([key, value]) => (
                    <span
                      key={key}
                      className="px-2 py-1 bg-dark-700 text-dark-300 text-xs rounded"
                    >
                      {value}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-dark-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-dark-300" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Price History Toggle */}
            <button
              onClick={() => setShowPriceHistory(!showPriceHistory)}
              className="w-full py-3 px-4 bg-dark-700 hover:bg-dark-600 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
            >
              <TrendingUp className="w-4 h-4" />
              {showPriceHistory ? 'Hide' : 'Show'} Price History (30 Days)
            </button>

            {/* Price History Chart */}
            {showPriceHistory && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <PriceHistoryChart productId={product.id} />
              </motion.div>
            )}

            {/* Store Comparison Table */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <StoreIcon className="w-5 h-5" />
                Compare Across {sortedPrices.length} Stores
              </h3>

              <div className="space-y-3">
                {sortedPrices.map((store, index) => (
                  <motion.div
                    key={store.storeSlug}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      index === 0
                        ? 'border-green-500/50 bg-green-500/5'
                        : 'border-dark-700 hover:border-dark-600'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-dark-700 rounded-lg flex items-center justify-center">
                          <StoreIcon className="w-5 h-5 text-primary-400" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-white flex items-center gap-2">
                            {store.store}
                            {index === 0 && (
                              <span className="px-2 py-0.5 bg-green-500 text-white text-xs rounded-full">
                                Best Price
                              </span>
                            )}
                          </h4>
                          <p className={`text-sm ${
                            store.inStock ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {store.inStock ? '✓ In Stock' : '✗ Out of Stock'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-white">
                          ${store.price.toFixed(2)}
                        </div>
                        {store.originalPrice && store.originalPrice > store.price && (
                          <div className="text-sm text-dark-400 line-through">
                            ${store.originalPrice.toFixed(2)}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Delivery & Pickup Options */}
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      {store.delivery?.available && (
                        <div className="p-2 bg-dark-700/50 rounded-lg">
                          <div className="flex items-center gap-1 text-xs text-dark-400 mb-1">
                            <Truck className="w-3 h-3" />
                            Delivery
                          </div>
                          <div className="text-sm text-white">
                            {store.delivery.price === 0 ? 'FREE' : `$${store.delivery.price}`}
                          </div>
                          <div className="text-xs text-dark-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {store.delivery.eta}
                          </div>
                        </div>
                      )}

                      {store.pickup?.available && (
                        <div className="p-2 bg-dark-700/50 rounded-lg">
                          <div className="flex items-center gap-1 text-xs text-dark-400 mb-1">
                            <StoreIcon className="w-3 h-3" />
                            Pickup
                          </div>
                          <div className="text-sm text-white">
                            {store.pickup.price === 0 ? 'FREE' : `$${store.pickup.price}`}
                          </div>
                          <div className="text-xs text-dark-400">
                            Available today
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Visit Store Button */}
                    {store.inStock && (
                      <a
                        href={store.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full py-2 px-4 bg-primary-600 hover:bg-primary-500 rounded-lg text-center font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        Visit Store
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
