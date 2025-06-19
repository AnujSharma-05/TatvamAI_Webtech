import { Inter } from 'next/font/google'
import { Providers } from './providers'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'], 
  variable: '--font-inter',
  display: 'swap',
})

export const metadata = {
  title: 'TatvamAI - Voice Technology for India',
  description:
    'Join our mission to create comprehensive voice datasets for Indian languages. Help make technology accessible to every corner of India through voice technology.',
  keywords: 'voice technology, Indian languages, AI, machine learning, voice datasets',
  authors: [{ name: 'TatvamAI Team' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} scroll-smooth`}>
      <body className="font-inter bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-100 antialiased transition-colors duration-300">
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Navbar />

            <main className="flex-grow animate-fade-in">
              {children}
            </main>

            <Footer />
          </div>

          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#0f172a',
                color: '#ffffff',
                fontWeight: 500,
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.15)',
              },
            }}
          />
        </Providers>
      </body>
    </html>
  )
}
