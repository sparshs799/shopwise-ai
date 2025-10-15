/**
 * Enhanced Product Card with more features
 * Improved UI/UX with better information display
 * 
 * @author GitHub Copilot Enhancement
 * @date October 14, 2025
 */

import { useState } from 'react';
import { Heart, TrendingDown, TrendingUp, Clock, Truck, MapPin, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function EnhancedProductCard({ 
  product, 
  isFavorite, 
  onToggleFavorite,
  onViewPriceHistory,
  onCompare 
}) {
  const [showAllPrices, setShowAllPrices] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Calculate best price and savings
  const prices = product.prices || [];
  const inStockPrices = prices.filter(p => p.inStock);
  const bestPrice = inStockPrices.length > 0 
    ? Math.min(...inStockPrices.map(p => p.price))
    : prices.length > 0 ? Math.min(...prices.map(p => p.price)) : 0;
  
  const bestPriceStore = prices.find(p => p.price === bestPrice);
  const maxOriginalPrice = Math.max(...prices.map(p => p.originalPrice || p.price));
  const savings = maxOriginalPrice - bestPrice;
  const savingsPercent = maxOriginalPrice > 0 ? ((savings / maxOriginalPrice) * 100).toFixed(0) : 0;

  // Sort prices by value
  const sortedPrices = [...prices].sort((a, b) => {
    if (a.inStock && !b.inStock) return -1;
    if (!a.inStock && b.inStock) return 1;
    return a.price - b.price;
  });

  const displayedPrices = showAllPrices ? sortedPrices : sortedPrices.slice(0, 3);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-dark-800 rounded-xl border border-dark-700 overflow-hidden hover:border-primary-500/50 transition-all group"
    >
      {/* Product Image */}
      <div className="relative aspect-video bg-dark-700 overflow-hidden">
        {!imageError ? (
          <img
            src={product.image}
            alt={product.name}
            onError={handleImageError}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-dark-500">
            <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
          </div>
        )}

        {/* Favorite Button */}
        <button
          onClick={() => onToggleFavorite(product.id)}
          className="absolute top-3 right-3 p-2 bg-dark-900/80 backdrop-blur-sm rounded-lg hover:bg-dark-900 transition-colors"
        >
          <Heart
            className={`w-5 h-5 transition-colors ${
              isFavorite ? 'fill-red-500 text-red-500' : 'text-white'
            }`}
          />
        </button>

        {/* Savings Badge */}
        {savingsPercent > 10 && (
          <div className="absolute top-3 left-3 px-3 py-1 bg-green-500 text-white text-sm font-bold rounded-lg flex items-center gap-1">
            <TrendingDown className="w-4 h-4" />
            Save {savingsPercent}%
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4 space-y-3">
        {/* Brand & Name */}
        <div>
          {product.brand && (
            <p className="text-xs text-primary-400 font-medium mb-1">{product.brand}</p>
          )}
          <h3 className="text-white font-semibold line-clamp-2 group-hover:text-primary-400 transition-colors">
            {product.name}
          </h3>
        </div>

        {/* Specs Preview */}
        {product.specs && (
          <div className="flex flex-wrap gap-2">
            {Object.entries(product.specs).slice(0, 3).map(([key, value]) => (
              <span
                key={key}
                className="px-2 py-1 bg-dark-700 text-dark-300 text-xs rounded"
              >
                {value}
              </span>
            ))}
          </div>
        )}

        {/* Best Price */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs text-dark-400">Best Price</p>
            <p className="text-2xl font-bold text-white">
              ${bestPrice.toFixed(2)}
            </p>
            {bestPriceStore && (
              <p className="text-xs text-dark-400 mt-1">
                at {bestPriceStore.store}
              </p>
            )}
          </div>
          {savings > 0 && (
            <div className="text-right">
              <p className="text-xs text-dark-400 line-through">
                ${maxOriginalPrice.toFixed(2)}
              </p>
              <p className="text-sm text-green-400 font-medium">
                Save ${savings.toFixed(2)}
              </p>
            </div>
          )}
        </div>

        {/* Price Comparison */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-dark-400">
            <span>Available at {prices.length} stores</span>
            <button
              onClick={() => setShowAllPrices(!showAllPrices)}
              className="text-primary-400 hover:text-primary-300 flex items-center gap-1"
            >
              {showAllPrices ? 'Show Less' : 'Show All'}
              {showAllPrices ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>

          <AnimatePresence>
            <motion.div className="space-y-2">
              {displayedPrices.map((priceInfo, index) => (
                <motion.div
                  key={`${priceInfo.store}-${index}`}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center justify-between p-2 bg-dark-700 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-white font-medium">
                      {priceInfo.store}
                    </span>
                    {!priceInfo.inStock && (
                      <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded">
                        Out of Stock
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-sm text-white font-semibold">
                        ${priceInfo.price.toFixed(2)}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-dark-400">
                        {priceInfo.delivery?.available && (
                          <span className="flex items-center gap-1">
                            <Truck className="w-3 h-3" />
                            {priceInfo.delivery.eta}
                          </span>
                        )}
                        {priceInfo.pickup?.available && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            Pickup
                          </span>
                        )}
                      </div>
                    </div>
                    <a
                      href={priceInfo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 bg-primary-500 hover:bg-primary-600 text-white rounded transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <button
            onClick={() => onViewPriceHistory(product.id)}
            className="flex-1 px-4 py-2 bg-dark-700 hover:bg-dark-600 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Clock className="w-4 h-4" />
            Price History
          </button>
          <button
            onClick={() => onCompare(product.id)}
            className="flex-1 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Compare
          </button>
        </div>
      </div>
    </motion.div>
  );
}
