import React from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-900">404</h1>
          <p className="mt-4 text-xl text-gray-600">Page not found</p>
          <Link to="/" className="mt-6 inline-block bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700">
            Go back home
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default NotFound 