'use client'

import { motion } from 'framer-motion'
import { useUser } from '@/context/UserContext'
import Link from 'next/link'

const actions = [
  {
    title: 'Contribute From Home',
    description: 'Record your voice in your preferred language',
    href: '/dashboard/contribute',
  },
  {
    title: 'Check History',
    description: 'View your past contributions and earnings',
    href: '/dashboard/history',
  },
  {
    title: 'About TatvamAI',
    description: 'Learn more about our mission',
    href: '/dashboard/about',
  },
]

export default function DashboardPage() {
  const { user } = useUser()

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white py-20">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Welcome back, {user?.name || 'Contributor'}!
          </h1>
          <p className="text-xl text-gray-300">
            Your voice is helping shape the future of Indian language technology
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-gray-800 rounded-xl p-8"
          >
            <div className="text-4xl font-bold text-blue-500 mb-2">
              {user?.tokens || 0}
            </div>
            <div className="text-gray-300">Tokens Earned</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-gray-800 rounded-xl p-8"
          >
            <div className="text-4xl font-bold text-blue-500 mb-2">
              {user?.contributedHours || 0}
            </div>
            <div className="text-gray-300">Hours Contributed</div>
          </motion.div>
        </div>

        {/* Actions Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {actions.map((action, index) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <Link href={action.href}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gray-800 rounded-xl p-8 h-full hover:bg-gray-700 transition-colors cursor-pointer"
                >
                  <h3 className="text-xl font-semibold mb-2">{action.title}</h3>
                  <p className="text-gray-300">{action.description}</p>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Contribution CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-16 text-center"
        >
          <Link href="/dashboard/contribute">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold"
            >
              Start Contributing Now
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </main>
  )
} 