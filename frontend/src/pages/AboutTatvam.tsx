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
      title: 'Radical Inclusivity',
      description: 'Our primary goal is to dismantle the language barriers that create a digital divide. We are building AI that understands the linguistic nuances of every corner of India, ensuring no voice is left behind.'
    },
    {
      icon: <Users size={24} />,
      title: 'Community Empowerment',
      description: 'We believe in building with, not for, the community. By enabling anyone to contribute their voice, we empower individuals to become active participants in shaping the future of technology.'
    },
    {
      icon: <BrainCircuit size={24} />,
      title: 'Foundational Innovation',
      description: 'Our mission extends to creating robust, open-source datasets that will serve as the bedrock for the next generation of voice-powered innovation in India, from startups to researchers.'
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
    <div style={{ background: 'transparent' }} className="min-h-screen flex items-center justify-center p-8 overflow-hidden">
      
      <motion.div
        className="relative z-10 max-w-6xl w-full"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div 
          className="grid md:grid-cols-5 gap-12 items-center p-10 md:p-16 rounded-2xl"
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
              Bridging Voices, <br/> Building <span style={{ color: COLORS.teaGreen }}>Futures.</span>
            </h1>
            <p className="text-lg text-slate-300 mb-6 leading-relaxed">
              At TatvamAI, our goal is to build a more equitable digital world. We believe that technology's true potential is unlocked only when it is accessible to everyone, regardless of the language they speak.
            </p>
            <p className="text-lg text-slate-300 mb-10 leading-relaxed">
              Beyond accessibility, this is a mission of cultural preservation and economic empowerment. By creating foundational voice technology for India's diverse languages, we enable new opportunities for education, commerce, and connection that honor our rich linguistic heritage.
            </p>

            {/* --- REVISED: Call-to-Action section --- */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-x-8 gap-y-4">
                <Link
                  to="/products"
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-full transition-all group"
                  style={{ background: COLORS.teaGreen, color: COLORS.midnightGreen }}
                >
                  Explore Our Work
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