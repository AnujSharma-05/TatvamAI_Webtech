import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white animate-slide-up">
      <div className="container-premium py-24">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-16">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-block mb-10 hover-lift">
              <span className="text-3xl font-bold gradient-text">
                TatvamAI
              </span>
            </Link>
            <p className="body-lg text-slate-300 mb-10 max-w-md leading-relaxed">
              Empowering India through voice technology. Join us in creating comprehensive voice datasets 
              that power the next generation of Indian language technology.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-slate-400 hover:text-white hover:scale-110 transition-all duration-300">
                <span className="sr-only">Twitter</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-slate-400 hover:text-white hover:scale-110 transition-all duration-300">
                <span className="sr-only">LinkedIn</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a href="#" className="text-slate-400 hover:text-white hover:scale-110 transition-all duration-300">
                <span className="sr-only">GitHub</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="heading-sm text-white mb-10">Quick Links</h3>
            <ul className="space-y-6">
              <li>
                <Link to="/about" className="body-md text-slate-300 hover:text-white transition-colors duration-300 hover:translate-x-2 inline-block">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/products" className="body-md text-slate-300 hover:text-white transition-colors duration-300 hover:translate-x-2 inline-block">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/blogs" className="body-md text-slate-300 hover:text-white transition-colors duration-300 hover:translate-x-2 inline-block">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/contact" className="body-md text-slate-300 hover:text-white transition-colors duration-300 hover:translate-x-2 inline-block">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="heading-sm text-white mb-10">Resources</h3>
            <ul className="space-y-6">
              <li>
                <Link to="/dashboard" className="body-md text-slate-300 hover:text-white transition-colors duration-300 hover:translate-x-2 inline-block">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/contributor" className="body-md text-slate-300 hover:text-white transition-colors duration-300 hover:translate-x-2 inline-block">
                  Become a Contributor
                </Link>
              </li>
              <li>
                <Link to="/demo" className="body-md text-slate-300 hover:text-white transition-colors duration-300 hover:translate-x-2 inline-block">
                  Demo
                </Link>
              </li>
              <li>
                <Link to="/auth/signin" className="body-md text-slate-300 hover:text-white transition-colors duration-300 hover:translate-x-2 inline-block">
                  Sign In
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-slate-700 mt-20 pt-10 flex flex-col lg:flex-row justify-between items-center">
          <p className="body-sm text-slate-400">
            © 2024 TatvamAI. All rights reserved.
          </p>
          <div className="flex space-x-10 mt-6 lg:mt-0">
            <Link to="/privacy" className="body-sm text-slate-400 hover:text-white transition-colors duration-300">
              Privacy Policy
            </Link>
            <Link to="/terms" className="body-sm text-slate-400 hover:text-white transition-colors duration-300">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}; 