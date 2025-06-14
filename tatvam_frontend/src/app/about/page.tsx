'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

const stats = [
  { number: '900M', label: 'internet users' },
  { number: '54%', label: 'rural' },
  { number: '$12B', label: 'market by 2030' },
]

const offerings = [
  {
    title: 'Domain-specific Speech Datasets',
    description: 'ASR/TTS datasets tailored for your industry needs',
    icon: '🎯',
  },
  {
    title: 'Multilingual Models',
    description: 'Pre-trained models that understand Indias languages',
    icon: '-',
  },
  {
    title: 'Plug-and-Play APIs',
    description: 'Easy integration for your applications',
    icon: '🔌',
  },
]

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* Vision Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-8">Our Vision</h1>
            <p className="text-xl md:text-2xl text-gray-300">
              "Every Indian should be able to talk to machines naturally."
            </p>
          </motion.div>
        </div>
      </section>

      {/* Why Voice Tech Section */}
      <section className="py-16 bg-gray-800">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-3xl font-bold mb-6">Why Voice Tech Needs India</h2>
            <p className="text-xl text-gray-300">
              English-dominant AIs exclude over 900M people. We fix that.
            </p>
          </motion.div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What We Offer</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {offerings.map((offering, index) => (
              <motion.div
                key={offering.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-gray-800 rounded-lg p-6 text-center"
              >
                <div className="text-4xl mb-4">{offering.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{offering.title}</h3>
                <p className="text-gray-300">{offering.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-16 bg-gray-800">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-3xl font-bold mb-8">Our Impact</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-700 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-3">Community Upliftment</h3>
                <p className="text-gray-300">
                  Uplift communities via inclusive data generation
                </p>
              </div>
              <div className="bg-gray-700 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-3">Ethical Data</h3>
                <p className="text-gray-300">
                  Create datasets with dignity, ethics, and precision
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.number}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-blue-500 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-300 text-lg">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Strip */}
      <section className="py-16 bg-blue-600">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-8">
              Join us in building voice tech for Bharat
            </h2>
            <Link href="/contact">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold"
              >
                Contact Us
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  )
} 