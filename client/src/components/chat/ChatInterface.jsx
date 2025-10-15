/**
 * Chat Interface Component
 * Simple search input for results page
 * 
 * @author Sparsh Srivastava
 */

import { useState } from 'react'
import { Search, Loader2 } from 'lucide-react'

export default function ChatInterface({ onSearch, loading }) {
  const [input, setInput] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (input.trim() && !loading) {
      onSearch(input)
      setInput('')
    }
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center gap-2">
          <Search className="absolute left-4 w-5 h-5 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Search for products..."
            disabled={loading}
            className="w-full pl-12 pr-32 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400 transition-all disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="absolute right-2 px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Searching...</span>
              </>
            ) : (
              'Search'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
