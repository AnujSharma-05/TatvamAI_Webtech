import { motion } from 'framer-motion'
import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { useNavigate, Link } from 'react-router-dom'
import axios from '../../../config/axios'

type Step = 1 | 2
type Gender = 'male' | 'female' | 'other'
type VerificationStatus = {
  phone: 'pending' | 'sent' | 'verified' | 'skipped'
  email: 'pending' | 'sent' | 'verified' | 'skipped'
}
type AuthMethod = 'phone' | 'email' | 'both'

type FormData = {
  name: string
  gender: Gender
  dob: string
  phone: string
  email: string
  city: string
  motherTongue: string
  knownLanguages: string[]
  password: string
  confirmPassword: string
}

const languages = [
  'Hindi',
  'Bengali',
  'Tamil',
  'Gujarati',
  'Punjabi',
  'Kannada',
  'Malayalam',
  'Marathi',
  'Telugu',
  'Urdu',
]

export default function SignUpPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState<Step>(1)
  const [authMethod, setAuthMethod] = useState<AuthMethod>('phone')
  const [phoneOtp, setPhoneOtp] = useState('')
  const [emailOtp, setEmailOtp] = useState('')
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>({
    phone: 'pending',
    email: 'pending'
  })
  const [formData, setFormData] = useState<FormData>({
    name: '',
    gender: 'male',
    dob: '',
    phone: '',
    email: '',
    city: '',
    motherTongue: '',
    knownLanguages: [],
    password: '',
    confirmPassword: '',
  })

  const handleSendPhoneOtp = async () => {
    if (!formData.phone) {
      toast.error('Please enter phone number')
      return
    }
    try {
      // Await the API call and get the OTP from response
      const res = await axios.post('/users/send-phone-otp', { phoneNo: formData.phone })
      if (!res.data.success) {
        throw new Error(res.data.message || 'Failed to send OTP')
      }
      setVerificationStatus(prev => ({ ...prev, phone: 'sent' }))
      toast.success('OTP sent to your phone!')
      // Show OTP in alert if present in response
      if (res.data && res.data.otp) {
        window.alert(`Your phone OTP is: ${res.data.otp}`)
      }
    } catch (error) {
      toast.error('Failed to send OTP')
    }
  }

  const handleSendEmailOtp = async () => {
    if (!formData.email) {
      toast.error('Please enter email address')
      return
    }
    try {
      // API call to send email verification
      axios.post('/users/send-verification-code', { email: formData.email })
      setVerificationStatus(prev => ({ ...prev, email: 'sent' }))
      toast.success('Verification email sent!')
    } catch (error) {
      toast.error('Failed to send verification email')
    }
  }

  const handleVerifyPhoneOtp = async () => {
    if (!phoneOtp) {
      toast.error('Please enter OTP')
      return
    }
    // TODO: Implement phone OTP verification
    try {
      // API call to verify phone OTP
      const response = await axios.post('/users/verify-phone-otp', {
        phoneNo: formData.phone,
        otp: phoneOtp,
      })
      if (!response.data.success) {
        throw new Error('Invalid OTP')
      }
      setVerificationStatus(prev => ({ ...prev, phone: 'verified' }))
      toast.success('Phone number verified!')
    } catch (error) {
      toast.error('Invalid OTP')
    }
  }

  const handleVerifyEmailOtp = async () => {
    if (!emailOtp) {
      toast.error('Please enter verification code')
      return
    }
    try {
      const response = await axios.post('/users/verify-email-code', {
        email: formData.email,
        code: emailOtp,
      })
      // Check for HTTP 200 or message
      if (response.status !== 200) {
        throw new Error('Invalid verification code')
      }
      setVerificationStatus(prev => ({ ...prev, email: 'verified' }))
      toast.success('Email verified!')
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || 'Invalid verification code'
      )
    }
  }

  const handleSkipPhone = () => {
    setVerificationStatus(prev => ({ ...prev, phone: 'skipped' }))
    toast('Phone verification skipped. You can verify later in profile.')
  }

  const handleSkipEmail = () => {
    setVerificationStatus(prev => ({ ...prev, email: 'skipped' }))
    toast('Email verification skipped. You can verify later in profile.')
  }

  const canProceedToStep2 = () => {
    const { phone, email, password, confirmPassword } = formData
    
    // Check if passwords match
    if (password !== confirmPassword) {
      toast.error('Passwords do not match! Please make sure both password fields are identical.')
      return false
    }
    
    if (password.length < 6) {
      toast.error('Password should be at least 6 characters')
      return false
    }
    
    // Check based on selected auth method
    if (authMethod === 'phone' && !phone) {
      toast.error('Please provide phone number for phone-based authentication')
      return false
    }
    
    if (authMethod === 'email' && !email) {
      toast.error('Please provide email address for email-based authentication')
      return false
    }
    
    if (authMethod === 'both' && (!phone || !email)) {
      toast.error('Please provide both phone number and email address')
      return false
    }
    
    return true
  }

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!canProceedToStep2()) return
    
    setStep(2)
  }

  const canCreateAccount = () => {
    const hasVerifiedPhone = verificationStatus.phone === 'verified'
    const hasVerifiedEmail = verificationStatus.email === 'verified'
    
    // Check based on selected auth method
    if (authMethod === 'phone' && !hasVerifiedPhone) {
      toast.error('Please verify your phone number to create account')
      return false
    }
    
    if (authMethod === 'email' && !hasVerifiedEmail) {
      toast.error('Please verify your email address to create account')
      return false
    }
    
    if (authMethod === 'both' && (!hasVerifiedPhone || !hasVerifiedEmail)) {
      toast.error('Please verify both phone number and email address')
      return false
    }
    
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!canCreateAccount()) return
    
    // TODO: Implement form submission
    try {
      // API call to create account
      await axios.post('/users/register', {
        ...formData,
        phoneNo: formData.phone, // map phone to phoneNo
        knownLanguages: formData.knownLanguages.join(','), // convert array to string
      })
      toast.success('Account created successfully!')
      navigate('/dashboard')
    } catch (error) {
      toast.error(
        error?.response?.data?.message || 'Failed to create account'
      )
    }
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
            <h1 className="text-4xl font-bold mb-4">Join TatvamAI</h1>
            <p className="text-gray-300">
              Help us build India's most powerful voice dataset
            </p>
          </motion.div>

          {/* Progress Steps */}
          <div className="flex justify-center mb-12">
            <div className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= 1 ? 'bg-blue-600' : 'bg-gray-700'
                }`}
              >
                1
              </div>
              <div
                className={`w-16 h-1 ${
                  step >= 2 ? 'bg-blue-600' : 'bg-gray-700'
                }`}
              />
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= 2 ? 'bg-blue-600' : 'bg-gray-700'
                }`}
              >
                2
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-gray-800 p-8 rounded-xl"
          >
            {step === 1 ? (
              <form onSubmit={handleNext} className="space-y-6">
                {/* Authentication Method Selection */}
                <div className="bg-gray-700 p-4 rounded-lg mb-6">
                  <h3 className="text-lg font-semibold mb-4 text-center">Choose Your Authentication Method</h3>
                  <p className="text-sm text-gray-300 mb-4 text-center">
                    Select how you want to sign in to your account in the future
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setAuthMethod('phone')}
                      className={`flex-1 py-2 px-3 rounded-lg font-medium transition-colors text-sm ${
                        authMethod === 'phone'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-600 text-gray-300'
                      }`}
                    >
                      Phone + OTP
                    </button>
                    <button
                      type="button"
                      onClick={() => setAuthMethod('email')}
                      className={`flex-1 py-2 px-3 rounded-lg font-medium transition-colors text-sm ${
                        authMethod === 'email'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-600 text-gray-300'
                      }`}
                    >
                      Email + Password
                    </button>
                    <button
                      type="button"
                      onClick={() => setAuthMethod('both')}
                      className={`flex-1 py-2 px-3 rounded-lg font-medium transition-colors text-sm ${
                        authMethod === 'both'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-600 text-gray-300'
                      }`}
                    >
                      Both Options
                    </button>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                      className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="gender" className="block text-sm font-medium mb-2">
                      Gender *
                    </label>
                    <select
                      id="gender"
                      value={formData.gender}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          gender: e.target.value as Gender,
                        })
                      }
                      required
                      className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="dob" className="block text-sm font-medium mb-2">
                      Date of Birth *
                    </label>
                    <input
                      type="date"
                      id="dob"
                      value={formData.dob}
                      onChange={(e) =>
                        setFormData({ ...formData, dob: e.target.value })
                      }
                      required
                      className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="city" className="block text-sm font-medium mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      id="city"
                      value={formData.city}
                      onChange={(e) =>
                        setFormData({ ...formData, city: e.target.value })
                      }
                      required
                      className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium mb-2">
                      Phone Number {(authMethod === 'phone' || authMethod === 'both') && '*'}
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      required={authMethod === 'phone' || authMethod === 'both'}
                      className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      Email Address {(authMethod === 'email' || authMethod === 'both') && '*'}
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required={authMethod === 'email' || authMethod === 'both'}
                      className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium mb-2">
                      Password *
                    </label>
                    <input
                      type="password"
                      id="password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      required
                      minLength={6}
                      className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
                      Confirm Password *
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        setFormData({ ...formData, confirmPassword: e.target.value })
                      }
                      required
                      minLength={6}
                      className={`w-full px-4 py-2 rounded-lg bg-gray-700 border focus:outline-none ${
                        formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword
                          ? 'border-red-500 focus:border-red-500'
                          : 'border-gray-600 focus:border-blue-500'
                      }`}
                    />
                    {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
                      <p className="text-red-400 text-sm mt-1">Passwords do not match</p>
                    )}
                  </div>
                </div>

                <div className="text-sm text-gray-400">
                  * Required fields based on your selected authentication method.
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold"
                >
                  Next - Verify Contact Details
                </motion.button>
              </form>
            ) : (
              <div className="space-y-8">
                {/* Phone Verification */}
                {(authMethod === 'phone' || authMethod === 'both') && formData.phone && (
                  <div className="border border-gray-600 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      Phone Verification
                      {verificationStatus.phone === 'verified' && (
                        <span className="ml-2 text-green-400">✓ Verified</span>
                      )}
                      {verificationStatus.phone === 'skipped' && (
                        <span className="ml-2 text-yellow-400">⚠ Skipped</span>
                      )}
                    </h3>
                    
                    {verificationStatus.phone === 'pending' && (
                      <div className="flex gap-4">
                        <button
                          onClick={handleSendPhoneOtp}
                          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
                        >
                          Send OTP
                        </button>
                        {authMethod !== 'phone' && (
                          <button
                            onClick={handleSkipPhone}
                            className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg"
                          >
                            Skip for now
                          </button>
                        )}
                      </div>
                    )}
                    
                    {verificationStatus.phone === 'sent' && (
                      <div className="space-y-4">
                        <input
                          type="text"
                          value={phoneOtp}
                          onChange={(e) => setPhoneOtp(e.target.value)}
                          placeholder="Enter OTP"
                          maxLength={6}
                          className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"
                        />
                        <div className="flex gap-4">
                          <button
                            onClick={handleVerifyPhoneOtp}
                            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg"
                          >
                            Verify OTP
                          </button>
                          <button
                            onClick={handleSendPhoneOtp}
                            className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg"
                          >
                            Resend OTP
                          </button>
                          {authMethod !== 'phone' && (
                            <button
                              onClick={handleSkipPhone}
                              className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg"
                            >
                              Skip for now
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Email Verification */}
                {(authMethod === 'email' || authMethod === 'both') && formData.email && (
                  <div className="border border-gray-600 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      Email Verification
                      {verificationStatus.email === 'verified' && (
                        <span className="ml-2 text-green-400">✓ Verified</span>
                      )}
                      {verificationStatus.email === 'skipped' && (
                        <span className="ml-2 text-yellow-400">⚠ Skipped</span>
                      )}
                    </h3>
                    
                    {verificationStatus.email === 'pending' && (
                      <div className="flex gap-4">
                        <button
                          onClick={handleSendEmailOtp}
                          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
                        >
                          Send Verification Email
                        </button>
                        {authMethod !== 'email' && (
                          <button
                            onClick={handleSkipEmail}
                            className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg"
                          >
                            Skip for now
                          </button>
                        )}
                      </div>
                    )}
                    
                    {verificationStatus.email === 'sent' && (
                      <div className="space-y-4">
                        <input
                          type="text"
                          value={emailOtp}
                          onChange={(e) => setEmailOtp(e.target.value)}
                          placeholder="Enter verification code"
                          maxLength={6}
                          className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"
                        />
                        <div className="flex gap-4">
                          <button
                            onClick={handleVerifyEmailOtp}
                            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg"
                          >
                            Verify Email
                          </button>
                          <button
                            onClick={handleSendEmailOtp}
                            className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg"
                          >
                            Resend Email
                          </button>
                          {authMethod !== 'email' && (
                            <button
                              onClick={handleSkipEmail}
                              className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg"
                            >
                              Skip for now
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Language Information */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label
                      htmlFor="motherTongue"
                      className="block text-sm font-medium mb-2"
                    >
                      Mother Tongue *
                    </label>
                    <select
                      id="motherTongue"
                      value={formData.motherTongue}
                      onChange={(e) =>
                        setFormData({ ...formData, motherTongue: e.target.value })
                      }
                      required
                      className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"
                    >
                      <option value="">Select language</option>
                      {languages.map((lang) => (
                        <option key={lang} value={lang}>
                          {lang}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Known Languages
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      {languages.map((lang) => (
                        <label key={lang} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={formData.knownLanguages.includes(lang)}
                            onChange={(e) => {
                              const updatedLangs = e.target.checked
                                ? [...formData.knownLanguages, lang]
                                : formData.knownLanguages.filter((l) => l !== lang)
                              setFormData({
                                ...formData,
                                knownLanguages: updatedLangs,
                              })
                            }}
                            className="rounded bg-gray-700 border-gray-600 text-blue-600 focus:ring-blue-500"
                          />
                          <span>{lang}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <motion.button
                      type="button"
                      onClick={() => setStep(1)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-8 py-3 rounded-lg font-semibold"
                    >
                      Back
                    </motion.button>
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold"
                    >
                      Create Account
                    </motion.button>
                  </div>
                </form>
              </div>
            )}
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="text-center mt-8 text-gray-400"
          >
            Already have an account?{' '}
            <Link to="/auth/signin" className="text-blue-400 hover:underline">
              Sign in
            </Link>
          </motion.p>
        </div>
      </div>
    </main>
  )
}