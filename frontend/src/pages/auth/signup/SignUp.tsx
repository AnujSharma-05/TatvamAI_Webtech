import { motion } from 'framer-motion'
import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { useNavigate, Link } from 'react-router-dom'

type Step = 1 | 2
type Gender = 'male' | 'female' | 'other'
type ContributionMethod = 'qr' | 'web'

type FormData = {
  name: string
  gender: Gender
  dob: string
  phone: string
  email: string
  city: string
  motherTongue: string
  knownLanguages: string[]
  preferredLanguage: string
  contributionMethod: ContributionMethod
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
  const [formData, setFormData] = useState<FormData>({
    name: '',
    gender: 'male',
    dob: '',
    phone: '',
    email: '',
    city: '',
    motherTongue: '',
    knownLanguages: [],
    preferredLanguage: '',
    contributionMethod: 'web',
  })

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement OTP verification for phone and email
    setStep(2)
    toast.success('OTP verified successfully!')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement form submission
    toast.success('Account created successfully!')
    navigate('/dashboard')
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
                      Full Name
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
                      Gender
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
                      Date of Birth
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
                    <label htmlFor="phone" className="block text-sm font-medium mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      required
                      className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      Email
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
                    <label htmlFor="city" className="block text-sm font-medium mb-2">
                      City
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
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold"
                >
                  Next
                </motion.button>
              </form>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="motherTongue"
                    className="block text-sm font-medium mb-2"
                  >
                    Mother Tongue
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

                <div>
                  <label
                    htmlFor="preferredLanguage"
                    className="block text-sm font-medium mb-2"
                  >
                    Preferred Language/Dialect
                  </label>
                  <select
                    id="preferredLanguage"
                    value={formData.preferredLanguage}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        preferredLanguage: e.target.value,
                      })
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
                    Contribution Method
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        value="web"
                        checked={formData.contributionMethod === 'web'}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            contributionMethod: e.target.value as ContributionMethod,
                          })
                        }
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span>Web</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        value="qr"
                        checked={formData.contributionMethod === 'qr'}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            contributionMethod: e.target.value as ContributionMethod,
                          })
                        }
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span>QR Code</span>
                    </label>
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