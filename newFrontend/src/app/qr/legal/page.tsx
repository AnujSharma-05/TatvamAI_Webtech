'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

const legalPoints = [
  {
    title: 'Data Usage',
    description:
      'Your voice recordings will be used to train AI models that help make technology more accessible in Indian languages.',
  },
  {
    title: 'Privacy Protection',
    description:
      'All data is anonymized before use. We never share your personal information with third parties.',
  },
  {
    title: 'Data Storage',
    description:
      'Your recordings are stored securely on encrypted servers and can be deleted upon request.',
  },
  {
    title: 'Consent & Control',
    description:
      'You have full control over your data and can withdraw consent at any time.',
  },
  {
    title: 'Academic Use',
    description:
      'Your contributions may be used in academic research to advance Indian language technology.',
  },
  {
    title: 'Commercial Applications',
    description:
      'Voice data may be used to develop commercial products that make technology accessible in Indian languages.',
  },
]

export default function LegalPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Legal Information</h1>
            <p className="text-xl text-gray-300">
              Understanding how we handle your voice data
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {legalPoints.map((point, index) => (
              <motion.div
                key={point.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-800 rounded-xl p-6"
              >
                <h2 className="text-xl font-semibold mb-3">{point.title}</h2>
                <p className="text-gray-300">{point.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="mt-16 text-center"
          >
            <p className="text-gray-300 mb-8">
              For more detailed information, please read our{' '}
              <a href="/privacy" className="text-blue-400 hover:underline">
                Privacy Policy
              </a>{' '}
              and{' '}
              <a href="/terms" className="text-blue-400 hover:underline">
                Terms of Service
              </a>
              .
            </p>

            <div className="flex gap-4 justify-center">
              <Link href="/qr">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-8 py-3 rounded-lg font-semibold"
                >
                  Back
                </motion.button>
              </Link>

              <Link href="/qr/consent">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold"
                >
                  I Understand & Agree
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </main>
  )
} 