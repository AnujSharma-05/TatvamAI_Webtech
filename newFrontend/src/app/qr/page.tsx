'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function QRPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl mx-auto text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-8">
            You're About to Power India's Voice Revolution
          </h1>

          <p className="text-xl text-gray-300 mb-12">
            Join thousands of contributors in building India's most comprehensive
            voice dataset. Your voice can help make technology accessible to millions.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <Link href="/qr/legal">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gray-800 p-8 rounded-xl cursor-pointer hover:bg-gray-700"
              >
                <div className="text-4xl mb-4">📋</div>
                <h2 className="text-xl font-semibold mb-2">Learn More</h2>
                <p className="text-gray-300">
                  Understand how we use and protect your voice data
                </p>
              </motion.div>
            </Link>

            <Link href="/qr/consent">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-blue-600 p-8 rounded-xl cursor-pointer hover:bg-blue-700"
              >
                <div className="text-4xl mb-4">🎙️</div>
                <h2 className="text-xl font-semibold mb-2">Start Contributing</h2>
                <p className="text-gray-100">
                  Begin your journey as a voice contributor
                </p>
              </motion.div>
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="mt-12 text-gray-400"
          >
            <p>
              By proceeding, you agree to participate in our voice data collection
              program.
            </p>
            <button
              onClick={() => window.close()}
              className="mt-4 text-blue-400 hover:underline"
            >
              Exit
            </button>
          </motion.div>
        </motion.div>
      </div>
    </main>
  )
} 