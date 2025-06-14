'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function Products() {
  const products = [
    {
      name: 'Hindi Voice Dataset',
      description: 'Comprehensive voice dataset for Hindi language with diverse accents and dialects.',
      features: ['50,000+ hours', 'Multiple accents', 'High quality', 'Annotated'],
      price: 'Contact for pricing',
      href: '/demo'
    },
    {
      name: 'Bengali Voice Dataset',
      description: 'Rich voice dataset for Bengali language covering various regional variations.',
      features: ['30,000+ hours', 'Regional dialects', 'Professional quality', 'Validated'],
      price: 'Contact for pricing',
      href: '/demo'
    },
    {
      name: 'Tamil Voice Dataset',
      description: 'Extensive voice dataset for Tamil language with natural speech patterns.',
      features: ['25,000+ hours', 'Natural speech', 'Multiple speakers', 'Verified'],
      price: 'Contact for pricing',
      href: '/demo'
    },
    {
      name: 'Gujarati Voice Dataset',
      description: 'Comprehensive voice dataset for Gujarati language and its variations.',
      features: ['20,000+ hours', 'Clear audio', 'Diverse speakers', 'Quality assured'],
      price: 'Contact for pricing',
      href: '/demo'
    },
    {
      name: 'Punjabi Voice Dataset',
      description: 'Rich voice dataset for Punjabi language with authentic pronunciation.',
      features: ['15,000+ hours', 'Authentic accents', 'High fidelity', 'Tested'],
      price: 'Contact for pricing',
      href: '/demo'
    },
    {
      name: 'Kannada Voice Dataset',
      description: 'Extensive voice dataset for Kannada language with regional variations.',
      features: ['18,000+ hours', 'Regional accents', 'Professional grade', 'Validated'],
      price: 'Contact for pricing',
      href: '/demo'
    }
  ]

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-premium">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="heading-lg text-gray-900 mb-6">
              Voice Datasets
            </h1>
            <p className="body-lg text-gray-600">
              High-quality voice datasets for Indian languages, powering the next generation of voice AI technology.
            </p>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="section-padding">
        <div className="container-premium">
          <div className="grid lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div key={product.name} className="card-premium p-8 rounded-2xl group hover:shadow-xl transition-all duration-500">
                <div className="space-y-6">
                  <div>
                    <h3 className="heading-sm text-gray-900 mb-3">{product.name}</h3>
                    <p className="body-md text-gray-600 leading-relaxed">{product.description}</p>
                  </div>
                  
                  <ul className="space-y-3">
                    {product.features.map((feature) => (
                      <li key={feature} className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-black rounded-full"></div>
                        <span className="body-sm text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="pt-6 border-t border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                      <span className="heading-sm text-gray-900">{product.price}</span>
                    </div>
                    <Link
                      href={product.href}
                      className="btn-primary w-full text-center"
                    >
                      Try Demo
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Custom Dataset Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-premium">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="heading-lg text-gray-900 mb-6">
              Need a custom dataset?
            </h2>
            <p className="body-lg text-gray-600 mb-12">
              We can create custom voice datasets tailored to your specific requirements and use cases.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="btn-primary"
              >
                Contact Us
              </Link>
              <Link
                href="/contributor"
                className="btn-secondary"
              >
                Become a Contributor
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding">
        <div className="container-premium">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="heading-lg text-gray-900">
                Quality Assurance
                <br />
                <span className="font-light">at Every Step</span>
              </h2>
              <p className="body-lg text-gray-600">
                Our datasets undergo rigorous quality checks and validation processes to ensure the highest standards for AI training and development.
              </p>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <div className="text-3xl font-light text-gray-900 mb-2">99.9%</div>
                  <div className="text-sm text-gray-500 uppercase tracking-wider">Accuracy</div>
                </div>
                <div>
                  <div className="text-3xl font-light text-gray-900 mb-2">24/7</div>
                  <div className="text-sm text-gray-500 uppercase tracking-wider">Support</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square image-placeholder rounded-2xl overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="w-32 h-32 mx-auto bg-gray-200 rounded-full flex items-center justify-center">
                      <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <p className="text-sm text-gray-500">Quality Assurance Image</p>
                    <p className="text-xs text-gray-400">Add quality/validation image here</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 