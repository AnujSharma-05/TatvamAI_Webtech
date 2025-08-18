import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HeartHandshake, Users, BrainCircuit, ArrowRight } from 'lucide-react';
import { COLORS } from '@/config/theme'; // Centralized color import

/**
 * A descriptive page explaining the core mission, vision, and goals of TatvamAI.
 * It is designed to be modular and inherit the global background and cursor.
 */
const AboutTatvamPage = () => {

  const pillars = [
    {
      icon: <HeartHandshake size={24} />,
      title: 'India-First Solutions',
      description: 'We create end-mile voice AI that truly understands Indian users – not just translations, but cultural nuances, intent, and code-mixing like Hinglish. Our solutions are trained on Indian speech patterns and expressions to understand local context and tone.'
    },
    {
      icon: <Users size={24} />,
      title: 'Multi-Model Intelligence',
      description: 'No single-model dependency. We deploy a curated suite of LLMs, each optimized for specific use cases. Our layered technology stack optimizes every interaction for human-like quality and accuracy, choosing the best model for each task.'
    },
    {
      icon: <BrainCircuit size={24} />,
      title: 'Proprietary Data Advantage',
      description: 'Built on proprietary datasets of Indian, code-mixed speech-to-text pairs and our own routing/formatting software. Poor-quality speech datasets cost businesses millions annually – we solve this with high-quality, India-specific training data.'
    }
  ];

  // Animation variants for a staggered fade-in effect
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: 'easeOut' }
    }
  };

  return (
    // The main container is transparent to let the global background from App.tsx show through.
    <div style={{ background: 'transparent' }} className="min-h-screen flex items-end justify-center p-8 pb-16 overflow-hidden">
      
      <motion.div
        className="relative z-10 max-w-6xl w-full"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div 
          className="grid md:grid-cols-5 gap-12  my-10 items-center p-10 md:p-16 rounded-2xl"
          style={{
              background: `linear-gradient(145deg, ${COLORS.midnightGreen}40, #002a3580)`,
              border: `1px solid ${COLORS.cadetGray}20`,
              backdropFilter: 'blur(12px)',
              boxShadow: `0 8px 32px 0 ${COLORS.midnightGreen}50`
          }}
        >
          {/* Left Column: The Narrative */}
          <motion.div className="md:col-span-3" variants={itemVariants}>
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6" style={{ color: COLORS.nyanza }}>
              Making AI Accessible to All, <br/> Through <span style={{ color: COLORS.teaGreen }}>Vernacular Voice Solutions</span>
            </h1>
            <p className="text-lg text-slate-300 mb-6 leading-relaxed">
              India's digital advancement is leaving behind a significant portion of its population. While 900 million Indians have internet access, only 270-300 million are digitally literate enough to leverage text-heavy AI interfaces. Just 3-5% speak English as their first language, yet are forced to navigate English-dominated applications.
            </p>
            <p className="text-lg text-slate-300 mb-6 leading-relaxed">
              90% of Indians prefer regional languages, but voice technology solutions remain English-centric. Global solutions like OpenAI, Google, and Microsoft have Word Error Rates of 20-30% for Hindi, and much higher for low-resource languages. This creates a massive underserved market of hundreds of millions who remain excluded from AI's benefits despite being connected.
            </p>
            <p className="text-lg text-slate-300 mb-10 leading-relaxed">
              At TatvamAI, we're solving this from the ground up by building solutions on proprietary data, creating street-smart AI solutions that deploy sector-specific vernacular solutions across India's 22 official languages and 121 widely spoken languages.
            </p>

            {/* --- REVISED: Call-to-Action section --- */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-x-8 gap-y-4">
                <Link
                  to="/products"
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-full transition-all group"
                  style={{ background: COLORS.teaGreen, color: COLORS.midnightGreen }}
                >
                  Explore Our Solutions
                  <ArrowRight className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                
                <Link
                  to="/contact"
                  className="group font-semibold text-lg inline-flex items-center gap-2"
                  style={{ color: COLORS.cadetGray }}
                >
                  Contact Us
                  <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
            </div>
          </motion.div>

          {/* Right Column: The Pillars */}
          <motion.div className="md:col-span-2 space-y-8" variants={itemVariants}>
            {pillars.map((pillar) => (
              <div key={pillar.title} className="flex items-start space-x-4">
                <div className="flex-shrink-0 mt-1 p-3 rounded-full" style={{ background: `${COLORS.teaGreen}10`, color: COLORS.teaGreen }}>
                  {pillar.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1" style={{color: COLORS.nyanza}}>{pillar.title}</h3>
                  <p className="text-slate-300">{pillar.description}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>

    </div>
  );
};

export default AboutTatvamPage;