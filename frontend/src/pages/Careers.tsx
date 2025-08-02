import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Briefcase, Sparkles, Users, ArrowRight } from 'lucide-react';
import { COLORS } from '@/config/theme'; 


const CareersPage = () => {
  const features = [
    {
      icon: <Sparkles size={20} />,
      text: 'Work on a mission that directly impacts millions of lives in India.'
    },
    {
      icon: <Users size={20} />,
      text: 'Join a collaborative, innovative, and mission-driven team.'
    },
    {
      icon: <Briefcase size={20} />,
      text: 'Opportunities for growth in a cutting-edge field of AI and voice technology.'
    }
  ];

  return (
    <div style={{ background: 'transparent', color: COLORS.nyanza }} className="relative min-h-screen flex items-center justify-center p-8 hide-default-cursor overflow-hidden">

      <motion.div
        className="relative z-10 max-w-4xl w-full text-center p-10 md:p-16 rounded-2xl"
        style={{
            background: `linear-gradient(145deg, ${COLORS.midnightGreen}40, #002a3580)`,
            border: `1px solid ${COLORS.cadetGray}20`,
            backdropFilter: 'blur(12px)',
            boxShadow: `0 8px 32px 0 ${COLORS.midnightGreen}50`
        }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <motion.h1
            className="text-5xl md:text-6xl font-extrabold mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
        >
            Join Our <span style={{ color: COLORS.teaGreen }}>Mission</span>
        </motion.h1>

        <motion.p
            className="text-xl max-w-2xl mx-auto mb-10"
            style={{ color: COLORS.cadetGray }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
        >
            We're looking for passionate individuals to help us build the future of voice technology for India. All opportunities will be posted here as our team grows.
        </motion.p>
        
        <div className="text-left max-w-xl mx-auto space-y-4 mb-12">
            {features.map((feature, index) => (
                <motion.div
                    key={index}
                    className="flex items-start space-x-4"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                >
                    <div className="flex-shrink-0 mt-1" style={{color: COLORS.teaGreen}}>{feature.icon}</div>
                    <p style={{color: COLORS.cadetGray}}>{feature.text}</p>
                </motion.div>
            ))}
        </div>

        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.8 }}
        >
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-full transition-all group"
              style={{ background: COLORS.teaGreen, color: COLORS.midnightGreen }}
            >
              Get In Touch
              <ArrowRight className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default CareersPage;