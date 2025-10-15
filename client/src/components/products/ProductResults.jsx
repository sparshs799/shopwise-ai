/**
 * Product Results Component
 * Displays search results with loading states
 * 
 * @author Sparsh Srivastava
 */

import { motion } from 'framer-motion'
import ProductCard from './ProductCard'
import ProductCardSkeleton from './ProductCardSkeleton'

export default function ProductResults({ products, loading, error, favorites, onToggleFavorite, sortBy }) {
  if (error) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 mb-4">
          <span className="text-2xl">⚠️</span>
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">Oops! Something went wrong</h3>
        <p className="text-dark-400">{error}</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return null
  }

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1
          }
        }
      }}
    >
      {products.map((product, index) => (
        <motion.div
          key={product.id}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
          }}
        >
          <ProductCard
            product={product}
            isFavorite={favorites.includes(product.id)}
            onToggleFavorite={onToggleFavorite}
          />
        </motion.div>
      ))}
    </motion.div>
  )
}
