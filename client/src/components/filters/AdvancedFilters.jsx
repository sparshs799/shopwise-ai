/**
 * Advanced Filter Component
 * Enhanced filtering with price ranges, multiple brands, and specs
 * 
 * @author GitHub Copilot Enhancement
 * @date October 14, 2025
 */

import { useState, useEffect } from 'react';
import { X, ChevronDown, ChevronUp, DollarSign, Tag, Cpu, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = [
  'laptops',
  'smartphones',
  'monitors',
  'headphones',
  'keyboards',
  'mice',
  'tablets',
  'smartwatches',
  'cameras',
];

const BRANDS = {
  laptops: ['ASUS', 'MSI', 'Lenovo', 'Dell', 'HP', 'Acer', 'Apple'],
  smartphones: ['Apple', 'Samsung', 'Google', 'OnePlus', 'Xiaomi'],
  monitors: ['LG', 'Samsung', 'Dell', 'ASUS', 'BenQ', 'Acer'],
  headphones: ['Sony', 'Bose', 'Apple', 'Sennheiser', 'JBL'],
};

const STORES = [
  { name: 'Best Buy', slug: 'bestbuy' },
  { name: 'Walmart', slug: 'walmart' },
  { name: 'Amazon', slug: 'amazon' },
  { name: 'Newegg', slug: 'newegg' },
  { name: 'Dell', slug: 'dell' },
  { name: 'Lenovo', slug: 'lenovo' },
  { name: 'Target', slug: 'target' },
];

export default function AdvancedFilters({ onApplyFilters, initialFilters = {} }) {
  const [filters, setFilters] = useState({
    category: initialFilters.category || '',
    brands: initialFilters.brands || [],
    minPrice: initialFilters.minPrice || '',
    maxPrice: initialFilters.maxPrice || '',
    stores: initialFilters.stores || [],
    inStockOnly: initialFilters.inStockOnly || false,
    freeShipping: initialFilters.freeShipping || false,
    ...initialFilters,
  });

  const [expandedSections, setExpandedSections] = useState({
    category: true,
    price: true,
    brands: true,
    stores: false,
    options: false,
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleCategoryChange = (category) => {
    setFilters(prev => ({
      ...prev,
      category: prev.category === category ? '' : category,
      brands: [], // Reset brands when category changes
    }));
  };

  const handleBrandToggle = (brand) => {
    setFilters(prev => ({
      ...prev,
      brands: prev.brands.includes(brand)
        ? prev.brands.filter(b => b !== brand)
        : [...prev.brands, brand],
    }));
  };

  const handleStoreToggle = (storeSlug) => {
    setFilters(prev => ({
      ...prev,
      stores: prev.stores.includes(storeSlug)
        ? prev.stores.filter(s => s !== storeSlug)
        : [...prev.stores, storeSlug],
    }));
  };

  const handlePriceChange = (type, value) => {
    setFilters(prev => ({
      ...prev,
      [type]: value,
    }));
  };

  const handleApplyFilters = () => {
    // Clean up filters before applying
    const cleanedFilters = {
      ...filters,
      minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,
      maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
    };
    onApplyFilters(cleanedFilters);
  };

  const handleResetFilters = () => {
    const resetFilters = {
      category: '',
      brands: [],
      minPrice: '',
      maxPrice: '',
      stores: [],
      inStockOnly: false,
      freeShipping: false,
    };
    setFilters(resetFilters);
    onApplyFilters(resetFilters);
  };

  const activeFilterCount = 
    (filters.category ? 1 : 0) +
    filters.brands.length +
    (filters.minPrice ? 1 : 0) +
    (filters.maxPrice ? 1 : 0) +
    filters.stores.length +
    (filters.inStockOnly ? 1 : 0) +
    (filters.freeShipping ? 1 : 0);

  const FilterSection = ({ title, icon: Icon, section, children }) => (
    <div className="border-b border-dark-700 last:border-0">
      <button
        onClick={() => toggleSection(section)}
        className="w-full flex items-center justify-between p-4 hover:bg-dark-700/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          {Icon && <Icon className="w-4 h-4 text-primary-400" />}
          <span className="font-medium text-white">{title}</span>
        </div>
        {expandedSections[section] ? (
          <ChevronUp className="w-4 h-4 text-dark-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-dark-400" />
        )}
      </button>
      <AnimatePresence>
        {expandedSections[section] && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4 pt-0 space-y-2">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <div className="bg-dark-800 rounded-xl border border-dark-700 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-dark-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-primary-400" />
          <h3 className="text-lg font-semibold text-white">Filters</h3>
          {activeFilterCount > 0 && (
            <span className="px-2 py-0.5 bg-primary-500 text-white text-xs rounded-full">
              {activeFilterCount}
            </span>
          )}
        </div>
        <button
          onClick={handleResetFilters}
          className="text-sm text-primary-400 hover:text-primary-300 transition-colors"
        >
          Reset All
        </button>
      </div>

      {/* Category Filter */}
      <FilterSection title="Category" icon={Tag} section="category">
        <div className="grid grid-cols-2 gap-2">
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                filters.category === category
                  ? 'bg-primary-500 text-white'
                  : 'bg-dark-700 text-dark-300 hover:bg-dark-600'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Price Range Filter */}
      <FilterSection title="Price Range" icon={DollarSign} section="price">
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-dark-400 mb-1">Min Price</label>
              <input
                type="number"
                placeholder="$0"
                value={filters.minPrice}
                onChange={(e) => handlePriceChange('minPrice', e.target.value)}
                className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white text-sm focus:outline-none focus:border-primary-500"
              />
            </div>
            <div>
              <label className="block text-xs text-dark-400 mb-1">Max Price</label>
              <input
                type="number"
                placeholder="$10000"
                value={filters.maxPrice}
                onChange={(e) => handlePriceChange('maxPrice', e.target.value)}
                className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white text-sm focus:outline-none focus:border-primary-500"
              />
            </div>
          </div>
          {/* Quick price buttons */}
          <div className="flex flex-wrap gap-2">
            {[500, 1000, 2000, 3000, 5000].map(price => (
              <button
                key={price}
                onClick={() => handlePriceChange('maxPrice', price)}
                className="px-3 py-1 bg-dark-700 hover:bg-dark-600 text-dark-300 text-xs rounded-lg transition-colors"
              >
                Under ${price}
              </button>
            ))}
          </div>
        </div>
      </FilterSection>

      {/* Brands Filter */}
      {filters.category && BRANDS[filters.category] && (
        <FilterSection title="Brands" icon={Cpu} section="brands">
          <div className="space-y-2">
            {BRANDS[filters.category].map(brand => (
              <label key={brand} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.brands.includes(brand)}
                  onChange={() => handleBrandToggle(brand)}
                  className="w-4 h-4 rounded border-dark-600 bg-dark-700 text-primary-500 focus:ring-primary-500 focus:ring-offset-dark-800"
                />
                <span className="text-sm text-dark-300 group-hover:text-white transition-colors">
                  {brand}
                </span>
              </label>
            ))}
          </div>
        </FilterSection>
      )}

      {/* Stores Filter */}
      <FilterSection title="Stores" icon={null} section="stores">
        <div className="space-y-2">
          {STORES.map(store => (
            <label key={store.slug} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.stores.includes(store.slug)}
                onChange={() => handleStoreToggle(store.slug)}
                className="w-4 h-4 rounded border-dark-600 bg-dark-700 text-primary-500 focus:ring-primary-500 focus:ring-offset-dark-800"
              />
              <span className="text-sm text-dark-300 group-hover:text-white transition-colors">
                {store.name}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Additional Options */}
      <FilterSection title="Options" icon={null} section="options">
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="checkbox"
              checked={filters.inStockOnly}
              onChange={(e) => setFilters(prev => ({ ...prev, inStockOnly: e.target.checked }))}
              className="w-4 h-4 rounded border-dark-600 bg-dark-700 text-primary-500 focus:ring-primary-500 focus:ring-offset-dark-800"
            />
            <span className="text-sm text-dark-300 group-hover:text-white transition-colors">
              In Stock Only
            </span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="checkbox"
              checked={filters.freeShipping}
              onChange={(e) => setFilters(prev => ({ ...prev, freeShipping: e.target.checked }))}
              className="w-4 h-4 rounded border-dark-600 bg-dark-700 text-primary-500 focus:ring-primary-500 focus:ring-offset-dark-800"
            />
            <span className="text-sm text-dark-300 group-hover:text-white transition-colors">
              Free Shipping
            </span>
          </label>
        </div>
      </FilterSection>

      {/* Apply Button */}
      <div className="p-4 border-t border-dark-700">
        <button
          onClick={handleApplyFilters}
          className="w-full px-4 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
}
