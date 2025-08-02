import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { COLORS } from '@/config/theme'; 
const Home = () => {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen p-4 overflow-hidden">
      <div className="relative z-10 flex flex-col items-center text-center">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative text-7xl sm:text-8xl md:text-9xl font-extrabold tracking-tighter text-transparent bg-clip-text"
          style={{
            backgroundImage: `linear-gradient(90deg, ${COLORS.nyanza}, ${COLORS.teaGreen}, ${COLORS.nyanza})`,
            backgroundSize: '200% 100%',
            animation: 'shine 5s linear infinite',
          }}
        >
          TatvamAI
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6, ease: 'easeOut' }}
          className="mt-4 text-xl md:text-2xl font-medium tracking-wide"
          style={{ color: COLORS.cadetGray }}
        >
          Democratizing Voice-Tech in India
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8, ease: 'easeOut' }}
        >
          <Link
            to="/products"
            className="group relative inline-flex items-center justify-center px-8 py-4 mt-10 text-sm font-medium rounded-full overflow-hidden transition-all duration-300"
            style={{ color: COLORS.teaGreen, border: `1px solid ${COLORS.teaGreen}40` }}
          >
            <span
              className="absolute inset-0 rounded-full transition-all duration-500 group-hover:opacity-100 opacity-0"
              style={{
                background: `radial-gradient(circle at center, ${COLORS.teaGreen}20, transparent 70%)`,
                filter: 'blur(15px)',
              }}
            />
            <span className="relative flex items-center">
              Explore Products
              <ArrowRight className="ml-2 transition-transform duration-300 group-hover:translate-x-1" size={20} />
            </span>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;