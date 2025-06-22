'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Let India Speak. One Voice at a Time.
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8">
            Join the movement to build India's most powerful multilingual voice dataset.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/auth/signup">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold"
              >
                Become a Contributor
              </motion.button>
            </Link>
            <Link href="/qr">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-transparent border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-semibold"
              >
                Scan QR to Participate
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Mission Statement */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="bg-gray-800 py-16"
      >
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold italic">
            "TatvamAI empowers digital devices to speak the language of a billion hearts."
          </h2>
        </div>
      </motion.section>

      {/* Languages Mosaic */}
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="text-center text-2xl md:text-3xl font-semibold text-gray-300"
          >
            नमस्ते | নমস্কার | வணக்கம் | નમસ્તે | ਸਤ ਸ੍ਰੀ ਅਕਾਲ | ನಮಸ್ಕಾರ
          </motion.div>
        </div>
      </section>

      {/* Why It Matters */}
      <section className="py-16 bg-gray-800">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              India Speaks. Tech Doesn't Listen Yet.
            </h2>
            <p className="text-xl text-gray-300">
              90% of Indians prefer regional languages. Let's fix that with better datasets.
            </p>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Scan or Sign Up" },
              { title: "Speak in your language" },
              { title: "Help train inclusive AI + Earn rewards" },
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="text-center p-6 bg-gray-800 rounded-lg"
              >
                <h3 className="text-xl font-semibold">{step.title}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Strip */}
      <section className="py-16 bg-blue-600">
        <div className="container mx-auto px-4 text-center">
          <motion.h2
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold"
          >
            Speak Your Tongue. Shape the Future.
          </motion.h2>
        </div>
      </section>
    </main>
  )
} 