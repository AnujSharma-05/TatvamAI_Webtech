'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { toast } from 'react-hot-toast'

type FormData = {
  name: string
  email: string
  org: string
  useCase: string
}

export default function DemoPage() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    org: '',
    useCase: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement form submission
    toast.success('Demo request sent successfully!')
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Request Early Access
            </h1>
            <p className="text-xl text-gray-300">
              We're in production phase. Be among the first to try TatvamAI's tools.
            </p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            onSubmit={handleSubmit}
            className="space-y-6 bg-gray-800 p-8 rounded-xl"
          >
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="org" className="block text-sm font-medium mb-2">
                Organization
              </label>
              <input
                type="text"
                id="org"
                value={formData.org}
                onChange={(e) => setFormData({ ...formData, org: e.target.value })}
                required
                className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="useCase" className="block text-sm font-medium mb-2">
                Use Case
              </label>
              <textarea
                id="useCase"
                value={formData.useCase}
                onChange={(e) => setFormData({ ...formData, useCase: e.target.value })}
                required
                rows={4}
                placeholder="Tell us how you plan to use TatvamAI's voice technology..."
                className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"
              />
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold"
            >
              Request Demo
            </motion.button>
          </motion.form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="mt-8 text-center text-gray-400 text-sm"
          >
            By submitting this form, you agree to our{' '}
            <a href="/terms" className="text-blue-400 hover:underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy" className="text-blue-400 hover:underline">
              Privacy Policy
            </a>
            .
          </motion.div>
        </div>
      </div>
    </main>
  )
} 