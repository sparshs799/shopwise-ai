/**
 * Header Component
 * Clean top navigation matching Bolt's design
 * 
 * @author Sparsh Srivastava
 */

import { Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Header() {
  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-800/50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-6 h-6 text-white" strokeWidth={2.5} />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-indigo-900 dark:from-white dark:to-indigo-200 bg-clip-text text-transparent">
                ShopWise AI
              </span>
            </div>
          </div>

          {/* Prototype Badge */}
          <div className="flex items-center gap-3">
            <span className="px-3 py-1.5 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 text-indigo-700 dark:text-indigo-300 text-sm font-medium rounded-full border border-indigo-200 dark:border-indigo-800">
              Prototype v1
            </span>
          </div>
        </div>
      </div>
    </motion.header>
  )
}
