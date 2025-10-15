/**
 * Price History Chart Component
 * Shows 30-day price trend using Recharts
 * 
 * @author Sparsh Srivastava
 */

import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { getPriceHistory } from '../../services/api'
import { Loader2 } from 'lucide-react'

export default function PriceHistoryChart({ productId }) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const { history } = await getPriceHistory(productId)
        setData(history)
      } catch (error) {
        console.error('Failed to load price history:', error)
      } finally {
        setLoading(false)
      }
    }
    loadHistory()
  }, [productId])

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary-400 animate-spin" />
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-dark-400">
        No price history available
      </div>
    )
  }

  const minPrice = Math.min(...data.map(d => d.price))
  const maxPrice = Math.max(...data.map(d => d.price))
  const avgPrice = data.reduce((sum, d) => sum + d.price, 0) / data.length

  return (
    <div className="p-4 bg-dark-800 rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-white">Price Trend (Last 30 Days)</h4>
        <div className="flex gap-4 text-sm">
          <div>
            <span className="text-dark-400">Min:</span>
            <span className="text-green-400 font-semibold ml-1">${minPrice.toFixed(2)}</span>
          </div>
          <div>
            <span className="text-dark-400">Avg:</span>
            <span className="text-primary-400 font-semibold ml-1">${avgPrice.toFixed(2)}</span>
          </div>
          <div>
            <span className="text-dark-400">Max:</span>
            <span className="text-red-400 font-semibold ml-1">${maxPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis
            dataKey="date"
            stroke="#94a3b8"
            tick={{ fill: '#94a3b8', fontSize: 12 }}
            tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          />
          <YAxis
            stroke="#94a3b8"
            tick={{ fill: '#94a3b8', fontSize: 12 }}
            domain={['dataMin - 50', 'dataMax + 50']}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '8px',
              color: '#ffffff'
            }}
            labelFormatter={(value) => new Date(value).toLocaleDateString()}
            formatter={(value) => [`$${value.toFixed(2)}`, 'Price']}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ fill: '#3b82f6', r: 3 }}
            activeDot={{ r: 5, fill: '#60a5fa' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
