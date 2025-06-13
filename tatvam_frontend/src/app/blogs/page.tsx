'use client'

import { motion } from 'framer-motion'

const blogs = [
  {
    title: 'Building Voice Tech for Bharat',
    summary: 'How TatvamAI is making technology accessible in Indian languages',
    link: 'https://medium.com/tatvam/building-voice-tech-for-bharat',
    platform: 'Medium',
    date: 'March 15, 2024',
  },
  {
    title: 'The Future of Voice AI in India',
    summary: 'Exploring the potential impact of multilingual voice technology',
    link: 'https://linkedin.com/company/tatvam/posts',
    platform: 'LinkedIn',
    date: 'March 10, 2024',
  },
  {
    title: 'Voice Data Collection: A Community Approach',
    summary: 'How were building inclusive datasets with community participation',
    link: 'https://medium.com/tatvam/voice-data-collection',
    platform: 'Medium',
    date: 'March 5, 2024',
  },
]

export default function BlogsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white py-20">
      <div className="container mx-auto px-4">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-5xl font-bold text-center mb-16"
        >
          Latest Updates
        </motion.h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {blogs.map((blog, index) => (
            <motion.a
              key={blog.title}
              href={blog.link}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              whileHover={{ scale: 1.05 }}
              className="block"
            >
              <div className="bg-gray-800 rounded-xl p-6 h-full hover:bg-gray-700 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-blue-400">{blog.platform}</span>
                  <span className="text-gray-400 text-sm">{blog.date}</span>
                </div>
                <h2 className="text-xl font-bold mb-3">{blog.title}</h2>
                <p className="text-gray-300">{blog.summary}</p>
                <div className="mt-4 text-blue-400 flex items-center">
                  Read more
                  <svg
                    className="w-4 h-4 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </div>
              </div>
            </motion.a>
          ))}
        </div>

        {/* Newsletter Signup */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-20 text-center max-w-2xl mx-auto"
        >
          <h2 className="text-2xl font-bold mb-4">Stay Updated</h2>
          <p className="text-gray-300 mb-6">
            Subscribe to our newsletter for the latest updates on voice technology and
            Indian language AI.
          </p>
          <form className="flex gap-4 justify-center">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500 flex-grow max-w-sm"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold"
            >
              Subscribe
            </motion.button>
          </form>
        </motion.div>
      </div>
    </main>
  )
} 