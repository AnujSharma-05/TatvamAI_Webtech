import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const Products = () => {
  const products = [
    {
      id: '1',
      name: 'AI Analytics Suite',
      description: 'Advanced analytics powered by artificial intelligence',
      price: 999,
    },
    {
      id: '2',
      name: 'Machine Learning Platform',
      description: 'Enterprise-grade ML platform for businesses',
      price: 1499,
    },
    // Add more products as needed
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Our Products</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900">{product.name}</h2>
                <p className="mt-2 text-gray-600">{product.description}</p>
                <p className="mt-4 text-2xl font-bold text-primary-600">${product.price}</p>
                <button className="mt-4 w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700">
                  Learn More
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Products 