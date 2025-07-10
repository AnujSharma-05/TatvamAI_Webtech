import { motion } from 'framer-motion'
import { useState } from 'react'
import { toast } from 'react-hot-toast' 
import { useNavigate, Link } from 'react-router-dom'
import axios from "../../../config/axios"
import { useAuth } from "../../AuthContext"; // adjust path if needed


type AuthMethod = 'phone' | 'email'

export default function SignInPage() {
  const navigate = useNavigate()
  const [authMethod, setAuthMethod] = useState<AuthMethod>('phone')
  const [contact, setContact] = useState('')
  const [otp, setOtp] = useState('')
  const [isOtpSent, setIsOtpSent] = useState(false)
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { setUser } = useAuth();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // TODO: Implement OTP sending
    try {
      const res = await axios.post('/users/send-phone-otp-login', { phoneNo: contact })
      if (res.data.success) {
        toast.success('OTP sent successfully!')
      } else {
        throw new Error('Failed to send OTP')
      }
    } catch (err: any) {
      if (err.response?.data?.message) {
        toast.error(err.response.data.message)
      } else {
        toast.error('Failed to send OTP')
      }
    } finally {
      setLoading(false)
    }
    setIsOtpSent(true)
    toast.success('OTP sent successfully!')
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('/users/login-phone-otp', {
        phoneNo: contact,
        otp,
      }, { withCredentials: true });
  
      // ✅ Set user in context
      setUser(res.data.data.user); // 🔁 match your API
  
      toast.success('Signed in successfully!');
      navigate('/dashboard');
    } catch (err: any) {
      if (err.response?.status === 403) {
        toast.error('Please verify your email and phone number before logging in');
      } else {
        toast.error('OTP verification failed');
      }
    } finally {
      setLoading(false);
    }
  };
  

  // Email login handler
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('/users/login', {
        email: contact,
        password,
      }, { 
            withCredentials: true,
            headers: { 'Content-Type': 'application/json' } 
          }
      );
  
      // ✅ Set user in context
      setUser(res.data.data.user); // 🔁 adjust according to your backend's response
  
      toast.success('Signed in successfully!');
      navigate('/dashboard');
    } catch (err: any) {
      if (err.response?.status === 403) {
        toast.error('Please verify your email and phone number before logging in');
      } else if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error('Login failed');
      }
    } finally {
      setLoading(false);
    }
  };
  

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

            {/* Email login with password */}
            {authMethod === 'email' ? (
              <form onSubmit={handleEmailLogin} className="space-y-6">
                <div>
                  <label htmlFor="contact" className="block text-sm font-medium mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="contact"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold"
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </motion.button>
              </form>
            ) : (
              // Phone OTP login (existing)
              !isOtpSent ? (
                <form onSubmit={handleSendOtp} className="space-y-6">
                  <div>
                    <label htmlFor="contact" className="block text-sm font-medium mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="contact"
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      placeholder="Enter your phone number"
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
                    Change phone number
                  </button>
                </form>
              )
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