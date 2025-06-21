import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">About Tatvam</h1>
          <div className="mt-6 prose prose-lg">
            <p>
              Tatvam is at the forefront of AI innovation, dedicated to developing cutting-edge solutions
              that transform the way businesses operate and people live.
            </p>
            <p className="mt-4">
              Our mission is to make artificial intelligence accessible, ethical, and beneficial for everyone.
              We believe in creating technology that enhances human capabilities rather than replacing them.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default About 