import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mic, GitBranch, Settings, ChevronRight, CheckCircle, Target, Heart, Eye } from "lucide-react";
import AnimatedBlobBackground from '@/components/Blobbg';



// --- Color Palette ---
const COLORS = {
  lightYellow: "#ffffe3",
  midnightGreen: "#003642",
  teaGreen: "#d0e6a5",
  nyanza: "#f1ffe3",
  cadetGray: "#83a0a0",
};

// --- Custom Cursor Component ---
const CustomCursor = () => {
  const [position, setPosition] = React.useState({ x: 0, y: 0 });

  React.useEffect(() => {
    const onMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', onMouseMove);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return (
    <>
      <div
        className="custom-cursor-glow"
        style={{ left: `${position.x}px`, top: `${position.y}px` }}
      />
      <div
        className="custom-cursor-dot"
        style={{ left: `${position.x}px`, top: `${position.y}px` }}
      />
    </>
  );
};


// --- Main Products Page Component ---
const ProductsPage = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 }
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
      tagline: "AI-Powered Translation & Dubbing",
      description: "Swarin leverages our extensive voice datasets to offer state-of-the-art translation and dubbing services. Preserve the original emotion and context of your content while reaching a global audience with natural-sounding voiceovers.",
      features: [
        "Context-aware AI translation",
        "Emotion-preserving speech synthesis",
        "Supports 10+ Indian languages",
        "Seamless API for easy integration"
      ],
      cta: {
        text: "Learn More",
        path: "/swarin"
      },
      isComingSoon: false,
    },
    {
      name: "ProductX",
      icon: <Settings size={32} style={{ color: COLORS.teaGreen }} />,
      tagline: "Your Custom Voice Solution",
      description: "Have a unique challenge that requires a voice-based solution? ProductX offers bespoke services, from developing custom speech models to creating specialized voice applications tailored to your specific business needs.",
      features: [
        "Custom speech model development",
        "Voice-enabled application design",
        "On-premise or cloud deployment",
        "Dedicated technical support"
      ],
      cta: {
        text: "Coming Soon",
        path: "#"
      },
      isComingSoon: true,
    }
  ];

  return (
    <div style={{ background: COLORS.midnightGreen, color: COLORS.nyanza }} className="relative min-h-screen p-8 md:p-16 hide-default-cursor overflow-hidden">
      <CustomCursor />
      <AnimatedBlobBackground />
      

      {/* --- Main Content Wrapper --- */}
      <div className="relative z-10">
        <motion.div
          className="max-w-7xl mx-auto"
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
                onClick={() => !product.isComingSoon && navigate(product.cta.path)}
                disabled={product.isComingSoon}
                className="mt-auto w-full flex items-center justify-center px-6 py-4 text-lg font-semibold rounded-full transition-all"
                style={{ 
                  background: product.isComingSoon ? COLORS.cadetGray : COLORS.teaGreen, 
                  color: COLORS.midnightGreen,
                  cursor: product.isComingSoon ? 'not-allowed' : 'pointer',
                  opacity: product.isComingSoon ? 0.6 : 1,
                }}
              >
                {product.cta.text} 
                {!product.isComingSoon && <ChevronRight className="w-5 h-5 ml-2" />}
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