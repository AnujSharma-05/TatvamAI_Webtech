import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mic, GitBranch, Settings, ChevronRight, CheckCircle, Target, Heart, Eye } from "lucide-react";
import { COLORS } from '@/config/theme';




// --- Main Products Page Component ---
const ProductsPage = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { delayChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };
  
  const aboutSectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.8,
            ease: "easeOut",
            staggerChildren: 0.2
        }
    }
  };

  const aboutItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6 } }
  };


  const products = [
    {
      name: "DhvaniShilp",
      icon: <Mic size={32} style={{ color: COLORS.teaGreen }} />,
      tagline: "The Voice of Digital India",
      description: "A collaborative platform designed to build rich, diverse, and high-quality voice datasets. DhvaniShilp empowers communities to contribute their languages and dialects, making AI more inclusive and accessible for everyone.",
      features: [
        "High-quality voice data collection",
        "Multi-language and dialect support",
        "Community-driven contribution model",
        "Robust data validation and processing"
      ],
      cta: {
        text: "Explore Platform",
        path: "/dhvani-shilp"
      },
      isComingSoon: false,
    },
    {
      name: "Swarin",
      icon: <GitBranch size={32} style={{ color: COLORS.teaGreen }} />,
      tagline: "India-First Voice AI Platform",
      description: "An advanced voice AI platform with human-like naturalness, hyper-personalized for India. Swarin creates intelligent interactions that build deep user connections – like a super-smart companion over chai. Multi-modal, multi-lingual, and multi-LLM voicebot that truly understands Indian users.",
      features: [
        "Understands Indian languages and code-mixing",
        "Cultural nuances and intent recognition",
        "Curated suite of LLMs for optimal responses",
        "Human-like quality and accuracy"
      ],
      cta: {
        text: "Learn More",
        path: "/swarin"
      },
      isComingSoon: false,
    },
    {
      name: "Spokn",
      icon: <Settings size={32} style={{ color: COLORS.teaGreen }} />,
      tagline: "Your Voice, Perfectly Typed",
      description: "Turn your speech into contextually formatted text anywhere – instantly. Press a hotkey in any app, speak naturally in your language, and watch it format and structure your words in real-time, as per the application's need. Works perfectly with Indian languages and code-mixing.",
      features: [
        "Context-aware formatting for any app",
        "Supports Indian languages and code-mixing",
        "Real-time structured text output",
        "Works with emails, docs, to-do lists"
      ],
      cta: {
        text: "Coming Soon",
        path: "/spokn"
      },
      isComingSoon: true,
    }
  ];

  return (
    <div style={{ background: 'transparent', color: COLORS.nyanza }} className="relative min-h-screen p-8 md:p-16 overflow-hidden">
   

      {/* --- Main Content Wrapper --- */}
      <div className="relative z-10">
        <motion.div
          className="max-w-7xl mx-auto my-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl md:text-7xl font-extrabold text-center mb-4">
            Our Suite of <span style={{ color: COLORS.teaGreen }}>Voice Solutions</span>
          </h1>
          <p className="text-xl text-center mb-16 mx-auto max-w-3xl" style={{ color: COLORS.cadetGray }}>
            From foundational data to end-user applications, our products are designed to break down language barriers and build a more inclusive digital world.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 lg:grid-cols-3 gap-10 max-w-7xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {products.map((product) => (
            <motion.div
              key={product.name}
              variants={itemVariants}
              className="flex flex-col rounded-2xl p-8 transition-all duration-300 relative"
              style={{
                background: `linear-gradient(145deg, ${COLORS.midnightGreen}30, #002a35)`,
                border: `1px solid ${COLORS.cadetGray}20`,
                boxShadow: `0 8px 32px 0 ${COLORS.midnightGreen}50`
              }}
              whileHover={!product.isComingSoon ? {
                transform: "translateY(-10px)",
                boxShadow: `0 12px 40px 0 ${COLORS.teaGreen}15`,
                border: `1px solid ${COLORS.teaGreen}40`
              } : {}}
            >
              {product.isComingSoon && (
                <div className="absolute top-4 right-4 bg-nyanza text-midnightGreen font-bold text-xs uppercase px-3 py-1 rounded-full shadow-lg">
                  Coming Soon
                </div>
              )}
              
              <div className="flex items-center mb-6">
                <div className="p-3 rounded-full mr-4" style={{ background: `${COLORS.teaGreen}10` }}>
                  {product.icon}
                </div>
                <div>
                  <h2 className="text-3xl font-bold">{product.name}</h2>
                  <p className="text-sm uppercase tracking-widest" style={{ color: COLORS.cadetGray }}>{product.tagline}</p>
                </div>
              </div>

              <p className="mb-8 flex-grow" style={{ color: COLORS.cadetGray }}>{product.description}</p>

              <div className="space-y-4 mb-8">
                {product.features.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="w-5 h-5 mr-3 flex-shrink-0" style={{ color: product.isComingSoon ? COLORS.cadetGray : COLORS.teaGreen }} />
                    <span style={{color: product.isComingSoon ? COLORS.cadetGray : 'inherit'}}>{feature}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => navigate(product.cta.path)}
                className="mt-auto w-full flex items-center justify-center px-6 py-4 text-lg font-semibold rounded-full transition-all"
                style={{ 
                  background: product.isComingSoon ? COLORS.cadetGray : COLORS.teaGreen, 
                  color: COLORS.midnightGreen,
                  cursor: 'pointer',
                  opacity: product.isComingSoon ? 0.8 : 1,
                }}
              >
                {product.cta.text} 
                <ChevronRight className="w-5 h-5 ml-2" />
              </button>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="max-w-7xl mx-auto mt-24 md:mt-32 p-8 md:p-12 rounded-2xl"
          style={{
              background: `${COLORS.midnightGreen}40`,
              border: `1px solid ${COLORS.cadetGray}20`,
              backdropFilter: 'blur(10px)',
          }}
          variants={aboutSectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-5 gap-12 items-center">
              <motion.div className="md:col-span-3 text-left" variants={aboutSectionVariants}>
                  <motion.h2 variants={aboutItemVariants} className="text-4xl md:text-5xl font-bold mb-6" style={{ color: COLORS.nyanza }}>
                      About <span style={{ color: COLORS.teaGreen }}>TatvamAI</span>
                  </motion.h2>
                  <motion.p variants={aboutItemVariants} className="text-lg leading-relaxed mb-6" style={{ color: COLORS.cadetGray }}>
                      TatvamAI is on a mission to dissolve the linguistic barriers that fragment the digital world. We believe that technology should be accessible to everyone, regardless of their language or literacy level. By building foundational AI tools centered around voice, we empower developers, businesses, and communities to create more inclusive and intuitive experiences for all.
                  </motion.p>
                  <motion.p variants={aboutItemVariants} className="text-lg leading-relaxed" style={{ color: COLORS.cadetGray }}>
                      Our work is rooted in collaboration and a deep respect for the rich linguistic diversity of India. We are not just building technology; we are building bridges.
                  </motion.p>
              </motion.div>
              <motion.div className="md:col-span-2 space-y-8" variants={aboutSectionVariants}>
                  <motion.div variants={aboutItemVariants} className="flex items-start">
                      <div className="p-3 rounded-full mr-4" style={{ background: `${COLORS.teaGreen}10`, color: COLORS.teaGreen }}><Target size={24}/></div>
                      <div>
                          <h3 className="text-xl font-bold" style={{ color: COLORS.nyanza }}>Our Mission</h3>
                          <p style={{ color: COLORS.cadetGray }}>To make technology universally accessible through voice.</p>
                      </div>
                  </motion.div>
                  <motion.div variants={aboutItemVariants} className="flex items-start">
                      <div className="p-3 rounded-full mr-4" style={{ background: `${COLORS.teaGreen}10`, color: COLORS.teaGreen }}><Eye size={24}/></div>
                      <div>
                          <h3 className="text-xl font-bold" style={{ color: COLORS.nyanza }}>Our Vision</h3>
                          <p style={{ color: COLORS.cadetGray }}>A digital future where every voice is heard and understood.</p>
                      </div>
                  </motion.div>
                  <motion.div variants={aboutItemVariants} className="flex items-start">
                      <div className="p-3 rounded-full mr-4" style={{ background: `${COLORS.teaGreen}10`, color: COLORS.teaGreen }}><Heart size={24}/></div>
                      <div>
                          <h3 className="text-xl font-bold" style={{ color: COLORS.nyanza }}>Our Values</h3>
                          <p style={{ color: COLORS.cadetGray }}>Inclusivity, Collaboration, and Innovation.</p>
                      </div>
                  </motion.div>
              </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductsPage;