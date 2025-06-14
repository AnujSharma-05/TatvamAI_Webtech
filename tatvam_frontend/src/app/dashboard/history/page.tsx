'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

type Contribution = {
  id: string
  date: string
  domain: string
  duration: number
  source: 'QR' | 'Web'
  qualityScore: number
  tokensEarned: number
}

// Sample data - replace with actual data from API
const sampleContributions: Contribution[] = [
  {
    id: '1',
    date: '2024-03-15',
    domain: 'Healthcare',
    duration: 120,
    source: 'Web',
    qualityScore: 95,
    tokensEarned: 50,
  },
  {
    id: '2',
    date: '2024-03-14',
    domain: 'Telecom',
    duration: 180,
    source: 'QR',
    qualityScore: 92,
    tokensEarned: 75,
  },
  {
    id: '3',
    date: '2024-03-13',
    domain: 'Retail',
    duration: 150,
    source: 'Web',
    qualityScore: 88,
    tokensEarned: 60,
  },
]

export default function HistoryPage() {
  const [sortField, setSortField] = useState<keyof Contribution>('date')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  const sortedContributions = [...sampleContributions].sort((a, b) => {
    if (sortDirection === 'asc') {
      return a[sortField] > b[sortField] ? 1 : -1
    }
    return a[sortField] < b[sortField] ? 1 : -1
  })

  const handleSort = (field: keyof Contribution) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    return `${minutes} min`
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto"
        >
          <h1 className="text-4xl font-bold mb-8">Contribution History</h1>

          {/* Stats Summary */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-gray-800 rounded-xl p-6"
            >
              <div className="text-3xl font-bold text-blue-500 mb-2">
                {sortedContributions.length}
              </div>
              <div className="text-gray-300">Total Contributions</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-gray-800 rounded-xl p-6"
            >
              <div className="text-3xl font-bold text-blue-500 mb-2">
                {sortedContributions.reduce(
                  (acc, curr) => acc + curr.tokensEarned,
                  0
                )}
              </div>
              <div className="text-gray-300">Total Tokens Earned</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-gray-800 rounded-xl p-6"
            >
              <div className="text-3xl font-bold text-blue-500 mb-2">
                {Math.round(
                  sortedContributions.reduce(
                    (acc, curr) => acc + curr.qualityScore,
                    0
                  ) / sortedContributions.length
                )}
                %
              </div>
              <div className="text-gray-300">Average Quality Score</div>
            </motion.div>
          </div>

          {/* Contributions Table */}
          <div className="bg-gray-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-700">
                    {[
                      { key: 'date', label: 'Date' },
                      { key: 'domain', label: 'Domain' },
                      { key: 'duration', label: 'Duration' },
                      { key: 'source', label: 'Source' },
                      { key: 'qualityScore', label: 'Quality Score' },
                      { key: 'tokensEarned', label: 'Tokens Earned' },
                    ].map(({ key, label }) => (
                      <th
                        key={key}
                        className="px-6 py-4 text-left text-sm font-semibold cursor-pointer hover:bg-gray-600"
                        onClick={() => handleSort(key as keyof Contribution)}
                      >
                        <div className="flex items-center">
                          {label}
                          {sortField === key && (
                            <span className="ml-2">
                              {sortDirection === 'asc' ? '↑' : '↓'}
                            </span>
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sortedContributions.map((contribution) => (
                    <motion.tr
                      key={contribution.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      className="border-t border-gray-700 hover:bg-gray-700"
                    >
                      <td className="px-6 py-4">
                        {new Date(contribution.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">{contribution.domain}</td>
                      <td className="px-6 py-4">
                        {formatDuration(contribution.duration)}
                      </td>
                      <td className="px-6 py-4">{contribution.source}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div
                            className="h-2 rounded-full bg-blue-600"
                            style={{ width: `${contribution.qualityScore}%` }}
                          />
                          <span className="ml-2">{contribution.qualityScore}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">{contribution.tokensEarned}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  )
} 