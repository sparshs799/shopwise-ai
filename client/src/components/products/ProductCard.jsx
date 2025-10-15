/**
 * Product Card Component
 * Individual product display with comparison modal
 * 
 * @author Sparsh Srivastava
 */

import { useState } from 'react'
import { Heart, TrendingDown, Store, Package, Eye } from 'lucide-react'
import { motion } from 'framer-motion'
import ComparisonModal from './ComparisonModal'

export default function ProductCard({ product, isFavorite, onToggleFavorite }) {
  const [showComparison, setShowComparison] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  const { name, brand, image, specs, priceRange, bestDeal, prices } = product

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="card-hover overflow-hidden group"
      >
        {/* Product Image */}
        <div className="relative aspect-video bg-dark-700 rounded-lg overflow-hidden mb-4">
          {!imageLoaded && (
            <div className="absolute inset-0 skeleton" />
          )}
          <img
            src={image}
            alt={name}
            onLoad={() => setImageLoaded(true)}
            className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-110 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
          
          {/* Favorite Button */}
          <button
            onClick={() => onToggleFavorite(product.id)}
            className={`absolute top-3 right-3 p-2 rounded-lg backdrop-blur-md transition-all ${
              isFavorite
                ? 'bg-red-500/80 text-white'
                : 'bg-dark-900/60 text-white hover:bg-dark-900/80'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>

          {/* Best Deal Badge */}
          {bestDeal.savings > 0 && (
            <div className="absolute top-3 left-3 px-2 py-1 bg-green-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1">
              <TrendingDown className="w-3 h-3" />
              Save ${bestDeal.savings}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-3">
          <div>
            <p className="text-xs text-dark-400 font-medium mb-1">{brand}</p>
            <h3 className="text-lg font-semibold text-white line-clamp-2 leading-tight">
              {name}
            </h3>
          </div>

          {/* Specs Summary */}
          <div className="flex flex-wrap gap-2">
            {Object.entries(specs)
              .slice(0, 3)
              .map(([key, value]) => (
                <span
                  key={key}
                  className="px-2 py-1 bg-dark-700 text-dark-300 text-xs rounded-md"
                >
                  {value}
                </span>
              ))}
          </div>

          {/* Price Range */}
          <div className="pt-3 border-t border-dark-700">
            <div className="flex items-baseline justify-between mb-2">
              <div>
                <span className="text-2xl font-bold text-white">
                  ${priceRange.min.toFixed(2)}
                </span>
                {priceRange.max > priceRange.min && (
                  <span className="text-sm text-dark-400 ml-2">
                    - ${priceRange.max.toFixed(2)}
                  </span>
                )}
              </div>
              <div className="text-right">
                <div className="text-xs text-dark-400 flex items-center gap-1">
                  <Store className="w-3 h-3" />
                  {prices.length} stores
                </div>
              </div>
            </div>

            {/* Best Deal Store */}
            <div className="flex items-center justify-between text-xs text-dark-400 mb-3">
              <span>Best at: {bestDeal.store}</span>
              {prices.some(p => p.inStock) && (
                <span className="text-green-400 flex items-center gap-1">
                  <Package className="w-3 h-3" />
                  In Stock
                </span>
              )}
            </div>

            {/* Compare Button */}
            <button
              onClick={() => setShowComparison(true)}
              className="w-full btn-primary text-sm py-2 flex items-center justify-center gap-2"
            >
              <Eye className="w-4 h-4" />
              Compare Stores
            </button>
          </div>
        </div>
      </motion.div>

      {/* Comparison Modal */}
      <ComparisonModal
        isOpen={showComparison}
        onClose={() => setShowComparison(false)}
        product={product}
      />
    </>
  )
}
