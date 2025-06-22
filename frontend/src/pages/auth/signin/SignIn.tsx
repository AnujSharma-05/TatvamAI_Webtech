import { motion } from 'framer-motion'
import { useState } from 'react'
import { toast } from 'react-hot-toast' 
import { useNavigate, Link } from 'react-router-dom'

type AuthMethod = 'phone' | 'email'

export default function SignInPage() {
  const navigate = useNavigate()
  const [authMethod, setAuthMethod] = useState<AuthMethod>('phone')
  const [contact, setContact] = useState('')
  const [otp, setOtp] = useState('')
  const [isOtpSent, setIsOtpSent] = useState(false)

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement OTP sending
    setIsOtpSent(true)
    toast.success('OTP sent successfully!')
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement OTP verification
    toast.success('Signed in successfully!')
    navigate('/dashboard')
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold mb-4">Welcome Back</h1>
            <p className="text-gray-300">Sign in to continue your contribution</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-gray-800 p-8 rounded-xl"
          >
            {/* Auth Method Selection */}
            <div className="flex gap-4 mb-8">
              <button
                onClick={() => setAuthMethod('phone')}
                className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                  authMethod === 'phone'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300'
                }`}
              >
                Phone
              </button>
              <button
                onClick={() => setAuthMethod('email')}
                className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                  authMethod === 'email'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300'
                }`}
              >
                Email
              </button>
            </div>

            {!isOtpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-6">
                <div>
                  <label
                    htmlFor="contact"
                    className="block text-sm font-medium mb-2"
                  >
                    {authMethod === 'phone' ? 'Phone Number' : 'Email Address'}
                  </label>
                  <input
                    type={authMethod === 'phone' ? 'tel' : 'email'}
                    id="contact"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder={
                      authMethod === 'phone'
                        ? 'Enter your phone number'
                        : 'Enter your email'
                    }
                    required
                    className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold"
                >
                  Send OTP
                </motion.button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div>
                  <label htmlFor="otp" className="block text-sm font-medium mb-2">
                    Enter OTP
                  </label>
                  <input
                    type="text"
                    id="otp"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter the OTP sent to you"
                    required
                    maxLength={6}
                    className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500 text-center text-2xl tracking-wider"
                  />
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold"
                >
                  Verify OTP
                </motion.button>

                <button
                  type="button"
                  onClick={() => setIsOtpSent(false)}
                  className="w-full text-gray-400 hover:text-white text-sm"
                >
                  Change {authMethod === 'phone' ? 'phone number' : 'email'}
                </button>
              </form>
            )}
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="text-center mt-8 text-gray-400"
          >
            Don't have an account?{' '}
            <Link to="/auth/signup" className="text-blue-400 hover:underline">
              Sign up
            </Link>
          </motion.p>
        </div>
      </div>
    </main>
  )
} 