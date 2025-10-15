/**
 * API Service
 * Handles all API communication with the backend
 * 
 * @author Sparsh Srivastava
 */

import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

const api = axios.create({
  baseURL: `${API_URL}/api`,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Generate or get session ID for favorites
const getSessionId = () => {
  let sessionId = localStorage.getItem('shopwise-session-id')
  if (!sessionId) {
    sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    localStorage.setItem('shopwise-session-id', sessionId)
  }
  return sessionId
}

// Add session ID to all requests
api.interceptors.request.use(config => {
  config.headers['X-Session-Id'] = getSessionId()
  return config
})

// Handle errors globally
api.interceptors.response.use(
  response => response.data,
  error => {
    console.error('API Error:', error)
    throw error.response?.data || { error: 'Network error' }
  }
)

/**
 * Search products with natural language query
 */
export const searchProducts = async (query) => {
  return api.post('/search', { query })
}

/**
 * Get product details by ID
 */
export const getProduct = async (productId) => {
  return api.get(`/products/${productId}`)
}

/**
 * Get similar products
 */
export const getSimilarProducts = async (productId) => {
  return api.get(`/products/${productId}/similar`)
}

/**
 * Get query suggestions
 */
export const getSuggestions = async (partialQuery = '') => {
  return api.get('/suggestions', { params: { q: partialQuery } })
}

/**
 * Get available stores
 */
export const getStores = async () => {
  return api.get('/stores')
}

/**
 * Get price history for a product
 */
export const getPriceHistory = async (productId, days = 30) => {
  return api.get(`/price-history/${productId}`, { params: { days } })
}

/**
 * Get user's favorites
 */
export const getFavorites = async () => {
  return api.get('/favorites')
}

/**
 * Add product to favorites
 */
export const addFavorite = async (productId) => {
  return api.post('/favorites', { productId })
}

/**
 * Remove product from favorites
 */
export const removeFavorite = async (productId) => {
  return api.delete(`/favorites/${productId}`)
}

/**
 * Get search history
 */
export const getSearchHistory = async () => {
  return api.get('/search/history')
}

export default api
