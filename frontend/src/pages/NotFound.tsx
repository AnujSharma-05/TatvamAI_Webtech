import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Code, Cpu, Zap, Clock } from "lucide-react";
import { COLORS } from "@/config/theme";

const ComingSoon = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.info(
      "Coming Soon page accessed for route:",
      location.pathname
    );
  }, [location.pathname]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.3, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100, damping: 10 }
    }
  };

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div style={{ background: 'transparent', minHeight: '100vh' }} className="relative flex items-center justify-center p-8 overflow-hidden">
      
      {/* Background Elements */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <motion.div 
          variants={floatingVariants}
          animate="animate"
          className="absolute w-32 h-32 rounded-full filter blur-3xl opacity-20 top-20 left-20" 
          style={{ backgroundColor: COLORS.teaGreen }} 
        />
        <motion.div 
          variants={floatingVariants}
          animate="animate"
          className="absolute w-24 h-24 rounded-full filter blur-2xl opacity-15 bottom-20 right-20" 
          style={{ animationDelay: '1s', backgroundColor: COLORS.cadetGray }} 
        />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-4xl text-center"
      >
        <div className="p-12 md:p-16 rounded-3xl my-10" style={{
          background: `linear-gradient(145deg, ${COLORS.midnightGreen}40, #002a3580)`,
          border: `1px solid ${COLORS.cadetGray}20`,
          backdropFilter: 'blur(12px)',
          boxShadow: `0 8px 32px 0 ${COLORS.midnightGreen}50`
        }}>
          
          {/* Icon Animation */}
          <motion.div 
            variants={itemVariants}
            className="flex justify-center mb-8"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="p-6 rounded-full"
              style={{ background: `${COLORS.teaGreen}10`, border: `2px solid ${COLORS.teaGreen}30` }}
            >
              <Code size={48} style={{ color: COLORS.teaGreen }} />
            </motion.div>
          </motion.div>

          {/* Main Title */}
          <motion.h1 
            variants={itemVariants}
            className="text-5xl md:text-7xl font-extrabold mb-6"
            style={{ color: COLORS.nyanza, textShadow: `0 0 30px ${COLORS.teaGreen}30` }}
          >
            Coming <span style={{ color: COLORS.teaGreen }}>Soon</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            variants={itemVariants}
            className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto"
            style={{ color: COLORS.cadetGray }}
          >
            Our developers are crafting something amazing for you. Stay tuned!
          </motion.p>

          {/* Features Grid */}
          <motion.div 
            variants={itemVariants}
            className="grid grid-cols-1 my-10 md:grid-cols-3 gap-6 mb-12"
          >
            <div className="p-6 rounded-xl" style={{ background: `${COLORS.midnightGreen}20`, border: `1px solid ${COLORS.cadetGray}10` }}>
              <div className="flex justify-center mb-4">
                <Cpu size={32} style={{ color: COLORS.teaGreen }} />
              </div>
              <h3 className="font-semibold mb-2" style={{ color: COLORS.nyanza }}>Advanced Features</h3>
              <p className="text-sm" style={{ color: COLORS.cadetGray }}>Building cutting-edge functionality</p>
            </div>
            
            <div className="p-6 rounded-xl" style={{ background: `${COLORS.midnightGreen}20`, border: `1px solid ${COLORS.cadetGray}10` }}>
              <div className="flex justify-center mb-4">
                <Zap size={32} style={{ color: COLORS.teaGreen }} />
              </div>
              <h3 className="font-semibold mb-2" style={{ color: COLORS.nyanza }}>Lightning Fast</h3>
              <p className="text-sm" style={{ color: COLORS.cadetGray }}>Optimizing for performance</p>
            </div>
            
            <div className="p-6 rounded-xl" style={{ background: `${COLORS.midnightGreen}20`, border: `1px solid ${COLORS.cadetGray}10` }}>
              <div className="flex justify-center mb-4">
                <Clock size={32} style={{ color: COLORS.teaGreen }} />
              </div>
              <h3 className="font-semibold mb-2" style={{ color: COLORS.nyanza }}>Worth the Wait</h3>
              <p className="text-sm" style={{ color: COLORS.cadetGray }}>Quality takes time</p>
            </div>
          </motion.div>

          {/* Status Message */}
          {/* <motion.div 
            variants={itemVariants}
            className="p-4 rounded-xl mb-8"
            style={{ background: `${COLORS.teaGreen}10`, border: `1px solid ${COLORS.teaGreen}30` }}
          >
            <p className="text-lg font-medium" style={{ color: COLORS.teaGreen }}>
              🚀 Development in Progress - Expected Launch Soon
            </p>
          </motion.div> */}

          {/* Call to Action */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <button
              onClick={() => navigate("/")}
              className="flex items-center px-8 py-4 text-lg font-semibold rounded-full shadow-lg transition-all transform hover:scale-105"
              style={{ background: COLORS.teaGreen, color: COLORS.midnightGreen }}
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Home
            </button>
            
            <button
              onClick={() => navigate("/contact")}
              className="flex items-center px-8 py-4 text-lg font-semibold rounded-full transition-all transform hover:scale-105"
              style={{ 
                border: `2px solid ${COLORS.teaGreen}80`, 
                color: COLORS.teaGreen, 
                background: `${COLORS.midnightGreen}30`,
                backdropFilter: 'blur(5px)'
              }}
            >
              Stay Updated
            </button>
          </motion.div>

          {/* Additional Info */}
          <motion.p 
            variants={itemVariants}
            className="mt-8 text-sm opacity-70"
            style={{ color: COLORS.cadetGray }}
          >
            Have questions? <span style={{ color: COLORS.teaGreen }}>Contact our team</span> for more information.
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
};

export default ComingSoon;
