'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import { toast } from 'react-hot-toast'

type Step = 'consent' | 'setup' | 'record'

const domains = [
  'Healthcare',
  'Telecom',
  'FMCG',
  'Retail',
  'Sports',
  'Education',
  'Technology',
]

export default function ContributePage() {
  const { selectedLanguage, setSelectedLanguage, availableLanguages } = useLanguage()
  const [step, setStep] = useState<Step>('consent')
  const [selectedDomain, setSelectedDomain] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)

  const handleConsent = () => {
    setStep('setup')
    toast.success('Thank you for your consent!')
  }

  const handleSetup = () => {
    if (!selectedLanguage || !selectedDomain) {
      toast.error('Please select both language and domain')
      return
    }
    setStep('record')
  }

  const toggleRecording = () => {
    // TODO: Implement actual recording logic
    setIsRecording(!isRecording)
    if (!isRecording) {
      setRecordingTime(0)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          {step === 'consent' && (
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-8">Consent Agreement</h1>
              <div className="bg-gray-800 p-8 rounded-xl mb-8 text-left">
                <h2 className="text-2xl font-semibold mb-4">Data Usage Terms</h2>
                <ul className="space-y-4 text-gray-300">
                  <li>• Your data helps train AI, but we keep it anonymous</li>
                  <li>• You can request deletion anytime</li>
                  <li>• Data is stored securely for academic/industry use</li>
                  <li>• You will be rewarded with tokens for your contribution</li>
                </ul>
              </div>
              <motion.button
                onClick={handleConsent}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold"
              >
                I Agree & Proceed
              </motion.button>
            </div>
          )}

          {step === 'setup' && (
            <div>
              <h1 className="text-4xl font-bold mb-8 text-center">Setup Recording</h1>
              <div className="space-y-8">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Select Language
                  </label>
                  <select
                    value={selectedLanguage?.code || ''}
                    onChange={(e) => {
                      const lang = availableLanguages.find(
                        (l) => l.code === e.target.value
                      )
                      setSelectedLanguage(lang || null)
                    }}
                    required
                    className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"
                  >
                    <option value="">Select a language</option>
                    {availableLanguages.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.name} ({lang.nativeName})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Select Domain
                  </label>
                  <select
                    value={selectedDomain}
                    onChange={(e) => setSelectedDomain(e.target.value)}
                    required
                    className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"
                  >
                    <option value="">Select a domain</option>
                    {domains.map((domain) => (
                      <option key={domain} value={domain}>
                        {domain}
                      </option>
                    ))}
                  </select>
                </div>

                <motion.button
                  onClick={handleSetup}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold"
                >
                  Start Recording
                </motion.button>
              </div>
            </div>
          )}

          {step === 'record' && (
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-8">Record Your Voice</h1>

              {/* Generated Text */}
              <div className="bg-gray-800 p-8 rounded-xl mb-8">
                <h2 className="text-xl font-semibold mb-4">Please read aloud:</h2>
                <p className="text-gray-300 text-lg">
                  {/* TODO: Replace with actual generated text */}
                  This is a sample text in {selectedLanguage?.name} for the{' '}
                  {selectedDomain} domain. The actual text will be generated based on
                  your selected preferences.
                </p>
              </div>

              {/* Recording Interface */}
              <div className="space-y-8">
                <div className="flex justify-center">
                  <motion.button
                    onClick={toggleRecording}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl ${
                      isRecording ? 'bg-red-600' : 'bg-blue-600'
                    }`}
                  >
                    {isRecording ? '⬛' : '🎙️'}
                  </motion.button>
                </div>

                {/* Recording Time */}
                <div className="text-2xl font-mono">
                  {Math.floor(recordingTime / 60)
                    .toString()
                    .padStart(2, '0')}
                  :{(recordingTime % 60).toString().padStart(2, '0')}
                </div>

                {/* Waveform Visualization */}
                <div className="h-24 bg-gray-700 rounded-lg">
                  {/* TODO: Add actual waveform visualization */}
                </div>

                <div className="flex gap-4 justify-center">
                  <motion.button
                    onClick={() => setStep('setup')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gray-700 hover:bg-gray-600 text-white px-8 py-3 rounded-lg font-semibold"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    onClick={() => {
                      // TODO: Implement submission logic
                      toast.success('Recording submitted successfully!')
                      setStep('setup')
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold"
                    disabled={!isRecording}
                  >
                    Submit Recording
                  </motion.button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </main>
  )
} 