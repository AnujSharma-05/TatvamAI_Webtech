import { Inter } from 'next/font/google'
import { Providers } from './providers'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export const metadata = {
  title: 'TatvamAI - Voice Technology for India',
  description:
    'Join our mission to create comprehensive voice datasets for Indian languages. Help make technology accessible to every corner of India through voice technology.',
  keywords: 'voice technology, Indian languages, AI, machine learning, voice datasets',
  authors: [{ name: 'TatvamAI Team' }],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} scroll-smooth`}>
      <body className="bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100 antialiased font-sans transition-colors duration-300">
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Navbar />

            <main className="flex-grow px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </main>

            <Footer />
          </div>

          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1f2937', // Tailwind gray-800
                color: '#f9fafb',       // Tailwind gray-50
                fontWeight: 500,
              },
            }}
          />
        </Providers>
      </body>
    </html>
  )
}
