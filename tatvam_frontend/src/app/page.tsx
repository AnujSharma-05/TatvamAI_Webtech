import Hero from './components/Hero';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="bg-white">
      <Hero />

      {/* Features Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-premium">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="heading-lg text-gray-900 mb-6">
              Building Voice Technology
              <br />
              <span className="font-light">for India's Future</span>
            </h2>
            <p className="body-lg text-gray-600">
              Join us in creating comprehensive voice datasets that power the next generation of Indian language technology.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            {/* Feature 1 */}
            <div className="card-premium p-8 rounded-2xl group">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </div>
                <h3 className="heading-sm text-gray-900">10+ Indian Languages</h3>
              </div>
              <p className="body-md text-gray-600 mb-6">
                Support for major Indian languages including Hindi, Bengali, Telugu, Tamil, and more with diverse accents and dialects.
              </p>
              <Link href="/products" className="inline-flex items-center text-sm font-medium text-black hover:text-gray-600 transition-colors">
                Learn more
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>

            {/* Feature 2 */}
            <div className="card-premium p-8 rounded-2xl group">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="heading-sm text-gray-900">Secure & Private</h3>
              </div>
              <p className="body-md text-gray-600 mb-6">
                Your voice data is protected with enterprise-grade security and privacy measures, ensuring complete confidentiality.
              </p>
              <Link href="/about" className="inline-flex items-center text-sm font-medium text-black hover:text-gray-600 transition-colors">
                Learn more
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>

            {/* Feature 3 */}
            <div className="card-premium p-8 rounded-2xl group">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="heading-sm text-gray-900">Earn Rewards</h3>
              </div>
              <p className="body-md text-gray-600 mb-6">
                Get rewarded for your contributions to Indian language voice technology while helping build the future of AI.
              </p>
              <Link href="/contributor" className="inline-flex items-center text-sm font-medium text-black hover:text-gray-600 transition-colors">
                Learn more
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="section-padding bg-white">
        <div className="container-premium">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="heading-lg text-gray-900 mb-6">
              How It Works
            </h2>
            <p className="body-lg text-gray-600">
              Contributing to our voice dataset is simple and rewarding. Here's how you can get started.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-16">
            <div className="text-center">
              <div className="w-20 h-20 bg-black text-white rounded-full flex items-center justify-center text-2xl font-light mx-auto mb-8">
                1
              </div>
              <h3 className="heading-sm text-gray-900 mb-4">Sign Up</h3>
              <p className="body-md text-gray-600">Create your account and choose your preferred Indian languages.</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-black text-white rounded-full flex items-center justify-center text-2xl font-light mx-auto mb-8">
                2
              </div>
              <h3 className="heading-sm text-gray-900 mb-4">Record Voice</h3>
              <p className="body-md text-gray-600">Record voice samples using our easy-to-use recording interface.</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-black text-white rounded-full flex items-center justify-center text-2xl font-light mx-auto mb-8">
                3
              </div>
              <h3 className="heading-sm text-gray-900 mb-4">Earn Rewards</h3>
              <p className="body-md text-gray-600">Get rewarded for your contributions and help build India's voice AI.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Image Showcase Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-premium">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="heading-lg text-gray-900">
                Empowering Voices
                <br />
                <span className="font-light">Across India</span>
              </h2>
              <p className="body-lg text-gray-600">
                Our platform connects contributors from every corner of India, creating a diverse and comprehensive voice dataset that represents the true linguistic diversity of our nation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/contributor" className="btn-primary text-center">
                  Become a Contributor
                </Link>
                <Link href="/demo" className="btn-secondary text-center">
                  View Demo
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] image-placeholder rounded-2xl overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="w-32 h-32 mx-auto bg-gray-200 rounded-full flex items-center justify-center">
                      <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <p className="text-sm text-gray-500">Community Image Placeholder</p>
                    <p className="text-xs text-gray-400">Add community/diversity image here</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-black text-white">
        <div className="container-premium">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="heading-lg mb-6">
              Ready to contribute?
              <br />
              <span className="font-light">Join TatvamAI today.</span>
            </h2>
            <p className="body-lg text-gray-300 mb-12">
              Be part of the revolution in Indian voice technology. Your voice matters.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signup" className="bg-white text-black px-8 py-4 text-sm font-medium tracking-wide uppercase hover:bg-gray-100 transition-all duration-300 ease-in-out">
                Get Started
              </Link>
              <Link href="/contact" className="border border-white text-white px-8 py-4 text-sm font-medium tracking-wide uppercase hover:bg-white hover:text-black transition-all duration-300 ease-in-out">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 