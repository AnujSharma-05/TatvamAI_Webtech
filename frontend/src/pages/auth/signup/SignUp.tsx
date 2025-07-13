import { motion } from 'framer-motion'
import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { useNavigate, Link } from 'react-router-dom'
import axios from '../../../config/axios'
import { Eye, EyeOff } from 'lucide-react'

type Step = 1 | 2
type Gender = 'male' | 'female' | 'other'
type VerificationStatus = {
  phone: 'pending' | 'sent' | 'verified'
  email: 'pending' | 'sent' | 'verified'
}

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
  const [phoneOtp, setPhoneOtp] = useState('')
  const [emailOtp, setEmailOtp] = useState('')
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>({
    phone: 'pending',
    email: 'pending'
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isCheckingExistence, setIsCheckingExistence] = useState(false)
  const [isSendingPhoneOtp, setIsSendingPhoneOtp] = useState(false)
  const [isSendingEmailOtp, setIsSendingEmailOtp] = useState(false)
  const [isVerifyingPhoneOtp, setIsVerifyingPhoneOtp] = useState(false)
  const [isVerifyingEmailOtp, setIsVerifyingEmailOtp] = useState(false)
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

  // Phone number validation
  const validatePhoneNumber = (phone: string) => {
    const phoneRegex = /^[6-9]\d{9}$/
    return phoneRegex.test(phone)
  }

  // Check if user already exists with phone or email
  const checkUserExistence = async (phone: string, email: string) => {
    try {
      // Create request body with only the fields that have values
      const requestBody: { phoneNo?: string; email?: string } = {};
      
      if (phone) requestBody.phoneNo = phone;
      if (email) requestBody.email = email;
  
      // If neither phone nor email is provided, return false
      if (!phone && !email) {
        return false;
      }
  
      console.log('Checking user existence with:', requestBody)
      const response = await axios.post('/users/check-user-existence', requestBody);
      
      console.log('User existence response:', response.data)
      
      // If we get a 200 response, user exists
      if (response.status === 200) {
        return true; // User exists
      }
      
      return false;
    } catch (error: any) {
      console.log('User existence check error:', error.response?.data)
      // Handle 404 - user not found (this is expected behavior)
      if (error.response?.status === 404) {
        return false; // User doesn't exist
      }
      
      // Handle other errors (network issues, server errors, etc.)
      console.log('Error checking user existence:', error.message);
      throw error; // Re-throw to be handled by the calling function
    }
  };

  const handleSendPhoneOtp = async () => {
    if (!formData.phone) {
      toast.error('Please enter phone number')
      return
    }

    if (!validatePhoneNumber(formData.phone)) {
      toast.error('Please enter a valid 10-digit phone number starting with 6, 7, 8, or 9')
      return
    }

    setIsSendingPhoneOtp(true)
    try {
      // Check if phone number already exists
      const res = await axios.post('/users/send-phone-otp-register', { phoneNo: formData.phone })
      setVerificationStatus(prev => ({ ...prev, phone: 'sent' }))
      toast.success('OTP sent to your phone!')
      // Show OTP in alert if present in response
      if (res.data.data && res.data.data.otp) {
        window.alert(`Your phone OTP is: ${res.data.data.otp}`)
      }
    } catch (error: any) {
      console.log('Phone OTP error:', error.response?.data)
      if (error?.response?.status === 400 && error?.response?.data?.message?.includes('already registered')) {
        toast.error('This phone number is already registered. Please use a different number or try logging in.')
        setVerificationStatus(prev => ({ ...prev, phone: 'pending' }))
      } else {
        toast.error(error?.response?.data?.message || 'Failed to send OTP')
      }
    } finally {
      setIsSendingPhoneOtp(false)
    }
  }

  const handleSendEmailOtp = async () => {
    if (!formData.email) {
      toast.error('Please enter email address')
      return
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address')
      return
    }

    setIsSendingEmailOtp(true)
    try {
      // API call to send email verification
      const res = await axios.post('/users/send-verification-code', { email: formData.email })
      setVerificationStatus(prev => ({ ...prev, email: 'sent' }))
      toast.success('Verification email sent!')
      // Show verification code in alert if present in response
      if (res.data.data && res.data.data.code) {
        window.alert(`Your email verification code is: ${res.data.data.code}`)
      }
    } catch (error: any) {
      console.log('Email OTP error:', error.response?.data)
      if (error?.response?.status === 400 && error?.response?.data?.message?.includes('already registered')) {
        toast.error('This email is already registered. Please use a different email or try logging in.')
        setVerificationStatus(prev => ({ ...prev, email: 'pending' }))
      } else {
        toast.error(error?.response?.data?.message || 'Failed to send verification email')
      }
    } finally {
      setIsSendingEmailOtp(false)
    }
  }

  const handleVerifyPhoneOtp = async () => {
    if (!phoneOtp) {
      toast.error('Please enter OTP')
      return
    }
    setIsVerifyingPhoneOtp(true)
    try {
      // API call to verify phone OTP
      const response = await axios.post('/users/verify-phone-otp', {
        phoneNo: formData.phone,
        otp: phoneOtp,
      })
      setVerificationStatus(prev => ({ ...prev, phone: 'verified' }))
      toast.success('Phone number verified!')
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Invalid OTP')
    } finally {
      setIsVerifyingPhoneOtp(false)
    }
  }

  const handleVerifyEmailOtp = async () => {
    if (!emailOtp) {
      toast.error('Please enter verification code')
      return
    }
    setIsVerifyingEmailOtp(true)
    try {
      const response = await axios.post('/users/verify-email-code', {
        email: formData.email,
        code: emailOtp,
      })
      setVerificationStatus(prev => ({ ...prev, email: 'verified' }))
      toast.success('Email verified!')
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || 'Invalid verification code'
      )
    } finally {
      setIsVerifyingEmailOtp(false)
    }
  }

  const canProceedToStep2 = () => {
    const { phone, email, password, confirmPassword, motherTongue } = formData
    
    // Check if passwords match
    if (password !== confirmPassword) {
      toast.error('Passwords do not match! Please make sure both password fields are identical.')
      return false
    }
    
    if (password.length < 6) {
      toast.error('Password should be at least 6 characters')
      return false
    }
    
    // Both phone and email are required for registration
    if (!phone) {
      toast.error('Please provide phone number')
      return false
    }
    
    if (!validatePhoneNumber(phone)) {
      toast.error('Please enter a valid 10-digit phone number starting with 6, 7, 8, or 9')
      return false
    }
    
    if (!email) {
      toast.error('Please provide email address')
      return false
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address')
      return false
    }
    
    if (!motherTongue) {
      toast.error('Please select your mother tongue')
      return false
    }
    
    return true
  }

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!canProceedToStep2()) return
    
    // Check if user already exists before proceeding to verification step
    setIsCheckingExistence(true)
    
    try {
      // Try to check user existence using a dedicated endpoint if available
      const userExists = await checkUserExistence(formData.phone, formData.email)
      
      if (userExists) {
        toast.error('A user with this phone number or email already exists. Please use different credentials or try logging in.')
        setIsCheckingExistence(false)
        return
      }
      
      // If no user exists, proceed to step 2
      setStep(2)
    } catch (error: any) {
      // If checking fails, we'll still proceed but the OTP functions will handle existence checking
      console.log('User existence check failed, proceeding to step 2')
      toast('Proceeding to verification step. If you encounter issues, please try again.')
      setStep(2)
    } finally {
      setIsCheckingExistence(false)
    }
  }

  const canCreateAccount = () => {
    const hasVerifiedPhone = verificationStatus.phone === 'verified'
    const hasVerifiedEmail = verificationStatus.email === 'verified'
    
    // Backend requires both email and phone verification for registration
    if (!hasVerifiedPhone) {
      toast.error('Please verify your phone number to create account')
      return false
    }
    
    if (!hasVerifiedEmail) {
      toast.error('Please verify your email address to create account')
      return false
    }
    
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!canCreateAccount()) return
    
    try {
      // Prepare the registration data
      const registrationData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        gender: formData.gender,
        dob: formData.dob,
        phoneNo: formData.phone, // map phone to phoneNo
        city: formData.city,
        motherTongue: formData.motherTongue,
        knownLanguages: formData.knownLanguages.join(','), // convert array to string
      }

      // API call to create account
      const response = await axios.post('/users/register', registrationData)
      
      // Handle successful registration
      toast.success('Account created successfully!')
      navigate('/dashboard')
    } catch (error: any) {
      console.error('Registration error:', error)
      if (error?.response?.status === 400) {
        const errorMessage = error?.response?.data?.message || 'Registration failed'
        
        if (errorMessage.includes('already exists') || errorMessage.includes('already registered')) {
          toast.error('A user with this email or phone number already exists. Please use different credentials or try logging in.')
        } else if (errorMessage.includes('verify your email')) {
          toast.error('Please verify your email address before creating account')
        } else if (errorMessage.includes('verify your phone')) {
          toast.error('Please verify your phone number before creating account')
        } else {
          toast.error(errorMessage)
        }
      } else {
        toast.error('Failed to create account. Please try again.')
      }
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
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      required
                      placeholder="Enter 10-digit number"
                      maxLength={10}
                      className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"
                    />
                    <p className="text-xs text-gray-400 mt-1">Enter a 10-digit number starting with 6, 7, 8, or 9</p>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                      className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="motherTongue" className="block text-sm font-medium mb-2">
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
                    <label htmlFor="password" className="block text-sm font-medium mb-2">
                      Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                        required
                        minLength={6}
                        className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500 pr-10"
                      />
                      <span
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
                      Confirm Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
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
                        } pr-10`}
                      />
                      <span
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400"
                      >
                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </span>
                    </div>
                    {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
                      <p className="text-red-400 text-sm mt-1">Passwords do not match</p>
                    )}
                  </div>
                </div>

                <div className="text-sm text-gray-400">
                  * Required fields for account creation.
                </div>



                <motion.button
                  type="submit"
                  disabled={isCheckingExistence}
                  whileHover={{ scale: isCheckingExistence ? 1 : 1.05 }}
                  whileTap={{ scale: isCheckingExistence ? 1 : 0.95 }}
                  className={`w-full text-white px-8 py-3 rounded-lg font-semibold ${
                    isCheckingExistence 
                      ? 'bg-gray-600 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {isCheckingExistence ? 'Checking...' : 'Next - Verify Contact Details'}
                </motion.button>
              </form>
            ) : (
              <div className="space-y-8">
                {/* Phone Verification */}
                {formData.phone && (
                  <div className="border border-gray-600 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      Phone Verification
                      {verificationStatus.phone === 'verified' && (
                        <span className="ml-2 text-green-400">✓ Verified</span>
                      )}
                    </h3>
                    
                    {verificationStatus.phone === 'pending' && (
                      <div className="flex gap-4">
                        <button
                          onClick={handleSendPhoneOtp}
                          disabled={isSendingPhoneOtp}
                          className={`px-4 py-2 rounded-lg ${
                            isSendingPhoneOtp 
                              ? 'bg-gray-600 cursor-not-allowed' 
                              : 'bg-blue-600 hover:bg-blue-700'
                          }`}
                        >
                          {isSendingPhoneOtp ? 'Sending...' : 'Send OTP'}
                        </button>
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
                            disabled={isVerifyingPhoneOtp}
                            className={`px-4 py-2 rounded-lg ${
                              isVerifyingPhoneOtp 
                                ? 'bg-gray-600 cursor-not-allowed' 
                                : 'bg-green-600 hover:bg-green-700'
                            }`}
                          >
                            {isVerifyingPhoneOtp ? 'Verifying...' : 'Verify OTP'}
                          </button>
                          <button
                            onClick={handleSendPhoneOtp}
                            disabled={isSendingPhoneOtp}
                            className={`px-4 py-2 rounded-lg ${
                              isSendingPhoneOtp 
                                ? 'bg-gray-600 cursor-not-allowed' 
                                : 'bg-gray-600 hover:bg-gray-700'
                            }`}
                          >
                            {isSendingPhoneOtp ? 'Sending...' : 'Resend OTP'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Email Verification */}
                {formData.email && (
                  <div className="border border-gray-600 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      Email Verification
                      {verificationStatus.email === 'verified' && (
                        <span className="ml-2 text-green-400">✓ Verified</span>
                      )}
                    </h3>
                    
                    {verificationStatus.email === 'pending' && (
                      <div className="flex gap-4">
                        <button
                          onClick={handleSendEmailOtp}
                          disabled={isSendingEmailOtp}
                          className={`px-4 py-2 rounded-lg ${
                            isSendingEmailOtp 
                              ? 'bg-gray-600 cursor-not-allowed' 
                              : 'bg-blue-600 hover:bg-blue-700'
                          }`}
                        >
                          {isSendingEmailOtp ? 'Sending...' : 'Send Verification Email'}
                        </button>
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
                            disabled={isVerifyingEmailOtp}
                            className={`px-4 py-2 rounded-lg ${
                              isVerifyingEmailOtp 
                                ? 'bg-gray-600 cursor-not-allowed' 
                                : 'bg-green-600 hover:bg-green-700'
                            }`}
                          >
                            {isVerifyingEmailOtp ? 'Verifying...' : 'Verify Email'}
                          </button>
                          <button
                            onClick={handleSendEmailOtp}
                            disabled={isSendingEmailOtp}
                            className={`px-4 py-2 rounded-lg ${
                              isSendingEmailOtp 
                                ? 'bg-gray-600 cursor-not-allowed' 
                                : 'bg-gray-600 hover:bg-gray-700'
                            }`}
                          >
                            {isSendingEmailOtp ? 'Sending...' : 'Resend Email'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Language Information */}
                <form onSubmit={handleSubmit} className="space-y-6">
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