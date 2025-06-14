"use client";
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.02]" 
             style={{
               backgroundImage: `radial-gradient(circle at 1px 1px, #000 1px, transparent 0)`,
               backgroundSize: '40px 40px'
             }}>
        </div>
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-white/50"></div>
      </div>

      <div className="container-premium relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="space-y-8 fade-in">
            {/* Badge */}
            <div className="inline-flex items-center space-x-3">
              <span className="px-4 py-2 bg-black text-white text-xs font-medium tracking-wider uppercase">
                New Release
              </span>
              <span className="text-sm text-gray-500">
                Supporting 10+ Indian Languages
              </span>
            </div>

            {/* Main Heading */}
            <div className="space-y-6">
              <h1 className="heading-xl text-gray-900">
                Voice Technology
                <br />
                <span className="font-light">for India's Future</span>
              </h1>
              
              <p className="body-lg text-gray-600 max-w-2xl leading-relaxed">
                Empowering a billion voices through comprehensive voice datasets. 
                Join our mission to make technology accessible to every corner of India.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-8">
              <Link href="/auth/signup" className="btn-primary text-center">
                Get Started
              </Link>
              <Link href="/demo" className="btn-secondary text-center">
                Try Demo
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-16 border-t border-gray-100">
              <div className="text-center">
                <div className="heading-md text-gray-900 mb-2">10+</div>
                <div className="text-sm text-gray-500 uppercase tracking-wider">Languages</div>
              </div>
              <div className="text-center">
                <div className="heading-md text-gray-900 mb-2">1,000+</div>
                <div className="text-sm text-gray-500 uppercase tracking-wider">Contributors</div>
              </div>
              <div className="text-center">
                <div className="heading-md text-gray-900 mb-2">50K+</div>
                <div className="text-sm text-gray-500 uppercase tracking-wider">Voice Hours</div>
              </div>
            </div>
          </div>

          {/* Visual Element */}
          <div className="relative slide-up">
            {/* Main Image Placeholder */}
            <div className="relative aspect-[4/3] image-placeholder rounded-2xl overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="w-24 h-24 mx-auto bg-gray-200 rounded-full flex items-center justify-center">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-500">Hero Image Placeholder</p>
                  <p className="text-xs text-gray-400">Add your main hero image here</p>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-gray-100 rounded-full opacity-50"></div>
            <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-gray-50 rounded-full opacity-30"></div>
            
            {/* Voice Wave Visualization */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-end space-x-1 h-16">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-black rounded-full animate-pulse"
                  style={{
                    height: `${Math.random() * 40 + 20}px`,
                    animationDelay: `${i * 0.1}s`,
                    animationDuration: '2s'
                  }}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="flex flex-col items-center space-y-2">
          <span className="text-xs text-gray-400 uppercase tracking-wider">Scroll</span>
          <div className="w-px h-8 bg-gray-300"></div>
        </div>
      </div>
    </section>
  );
} 