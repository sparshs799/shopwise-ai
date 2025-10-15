/**
 * Filter Sidebar Component
 * Side panel with advanced filtering options
 * 
 * @author Sparsh Srivastava
 */

import { X, SlidersHorizontal } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

export default function FilterSidebar({ isOpen, onClose, filters, onApplyFilters }) {
  const [localFilters, setLocalFilters] = useState({
    minPrice: '',
    maxPrice: '',
    brands: [],
    categories: [],
    inStock: true
  })

  const categories = ['Laptops', 'Smartphones', 'Monitors', 'Headphones', 'Keyboards', 'Tablets']
  const brands = ['Apple', 'Samsung', 'Dell', 'HP', 'Lenovo', 'ASUS', 'MSI', 'LG', 'Sony']

  const handleApply = () => {
    onApplyFilters(localFilters)
    onClose()
  }

  const handleReset = () => {
    setLocalFilters({
      minPrice: '',
      maxPrice: '',
      brands: [],
      categories: [],
      inStock: true
    })
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: 300 }}
            animate={{ x: 0 }}
            exit={{ x: 300 }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md glass border-l border-dark-700 z-50 overflow-y-auto custom-scrollbar"
          >
            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5 text-primary-400" />
                  <h2 className="text-xl font-bold text-white">Filters</h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-dark-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-dark-300" />
                </button>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-white mb-3">
                  Price Range
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="number"
                    placeholder="Min"
                    value={localFilters.minPrice}
                    onChange={(e) => setLocalFilters({ ...localFilters, minPrice: e.target.value })}
                    className="input text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={localFilters.maxPrice}
                    onChange={(e) => setLocalFilters({ ...localFilters, maxPrice: e.target.value })}
                    className="input text-sm"
                  />
                </div>
              </div>

              {/* Categories */}
              <div>
                <label className="block text-sm font-medium text-white mb-3">
                  Categories
                </label>
                <div className="space-y-2">
                  {categories.map(category => (
                    <label key={category} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={localFilters.categories.includes(category)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setLocalFilters({
                              ...localFilters,
                              categories: [...localFilters.categories, category]
                            })
                          } else {
                            setLocalFilters({
                              ...localFilters,
                              categories: localFilters.categories.filter(c => c !== category)
                            })
                          }
                        }}
                        className="w-4 h-4 rounded border-dark-600 bg-dark-700 text-primary-600 focus:ring-2 focus:ring-primary-500/20"
                      />
                      <span className="text-sm text-dark-300">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Brands */}
              <div>
                <label className="block text-sm font-medium text-white mb-3">
                  Brands
                </label>
                <div className="space-y-2">
                  {brands.map(brand => (
                    <label key={brand} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={localFilters.brands.includes(brand)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setLocalFilters({
                              ...localFilters,
                              brands: [...localFilters.brands, brand]
                            })
                          } else {
                            setLocalFilters({
                              ...localFilters,
                              brands: localFilters.brands.filter(b => b !== brand)
                            })
                          }
                        }}
                        className="w-4 h-4 rounded border-dark-600 bg-dark-700 text-primary-600 focus:ring-2 focus:ring-primary-500/20"
                      />
                      <span className="text-sm text-dark-300">{brand}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Availability */}
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localFilters.inStock}
                    onChange={(e) => setLocalFilters({ ...localFilters, inStock: e.target.checked })}
                    className="w-4 h-4 rounded border-dark-600 bg-dark-700 text-primary-600 focus:ring-2 focus:ring-primary-500/20"
                  />
                  <span className="text-sm font-medium text-white">In Stock Only</span>
                </label>
              </div>

              {/* Actions */}
              <div className="pt-6 space-y-3 border-t border-dark-700">
                <button onClick={handleApply} className="w-full btn-primary">
                  Apply Filters
                </button>
                <button onClick={handleReset} className="w-full btn-secondary">
                  Reset All
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
