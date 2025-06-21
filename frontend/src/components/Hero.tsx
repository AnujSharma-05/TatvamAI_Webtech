import { Link } from 'react-router-dom';

export const Hero = () => {
  return (
    <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center space-x-4 mb-8">
            <span className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold tracking-wide uppercase rounded-full shadow-lg">
              New Release
            </span>
            <span className="text-base text-slate-300 font-medium">
              Supporting 10+ Indian Languages
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Voice Technology
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              for India's Future
            </span>
          </h1>
          
          <p className="text-xl text-slate-300 mb-8 leading-relaxed max-w-2xl mx-auto">
            Empowering a billion voices through comprehensive voice datasets. 
            Join our mission to make technology accessible to every corner of India.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
            <Link to="/auth/signup" className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105">
              Get Started
            </Link>
            <Link to="/demo" className="inline-flex items-center justify-center px-8 py-4 border-2 border-slate-600 text-slate-300 font-semibold rounded-xl hover:bg-slate-700 transition-all duration-300">
              Try Demo
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-md mx-auto">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-1">10+</div>
              <div className="text-sm text-slate-400 uppercase tracking-wider font-semibold">Languages</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-1">1,000+</div>
              <div className="text-sm text-slate-400 uppercase tracking-wider font-semibold">Contributors</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-1">50K+</div>
              <div className="text-sm text-slate-400 uppercase tracking-wider font-semibold">Voice Hours</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}; 