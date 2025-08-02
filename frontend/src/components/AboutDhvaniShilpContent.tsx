import React from 'react';
import { motion } from 'framer-motion';
import { Hexagon, Coins, ShieldCheck, UserX } from 'lucide-react';
import { COLORS } from '@/config/theme';

// Helper component for the card to avoid repetition
const Card = ({ content }: { content: { title: string; content: string } }) => (
    <div
        className="p-8 rounded-2xl"
        style={{
            background: `linear-gradient(145deg, ${COLORS.midnightGreen}30, #002a35)`,
            border: `1px solid ${COLORS.cadetGray}20`,
            boxShadow: `0 8px 32px 0 ${COLORS.midnightGreen}50`
        }}
    >
        <h2 className="text-3xl font-bold mb-3" style={{ color: COLORS.nyanza }}>{content.title}</h2>
        <p className="text-base" style={{ color: COLORS.cadetGray }}>{content.content}</p>
    </div>
);

// The component is no longer a full "page" but a block of content.
const AboutDhvaniShilpContent = () => {

  const timelineSections = [
    {
      icon: <Hexagon size={24} />,
      title: "Crowdsourcing for India's AI",
      content: "DhvaniShilp is a community-driven platform where every voice matters. Your contributions of speech data are the building blocks for creating more accurate and inclusive AI models for all Indian languages."
    },
    {
      icon: <Coins size={24} />,
      title: 'Earn Tokens, Get Rewards',
      content: "For your valuable contributions, you earn Dhvani Tokens. These tokens can be accumulated and converted into tangible rewards, acknowledging your crucial role in our mission."
    },
    {
      icon: <ShieldCheck size={24} />,
      title: 'DPDP Act Compliant',
      content: "We are fully compliant with the Digital Personal Data Protection (DPDP) Act, 2025. Your data is processed with the highest standards of security, legality, and transparency."
    },
    {
      icon: <UserX size={24} />,
      title: 'Your Data, Your Control',
      content: "Your privacy is our priority. We provide clear consent mechanisms and empower you with the choice to opt-out at any time, giving you complete control over your data."
    },
  ];

  const cardVariants = {
    left: {
        hidden: { opacity: 0, x: -50 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut' } }
    },
    right: {
        hidden: { opacity: 0, x: 50 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut' } }
    }
  };

  // The outermost div that made this a "page" has been removed.
  // We now return the content directly.
  return (
      <div className="relative z-10 max-w-7xl mx-auto isolate" style={{ background: 'transaparent'}}>
        <motion.div
            className="text-center mb-24"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
        >
            <h1 className="text-5xl md:text-7xl font-extrabold mb-4">
                <span style={{ color: 'white' }}>What is</span>  <span style={{ color: COLORS.teaGreen }}>DhvaniShilp</span> <span style={{ color: 'white' }}>?</span>
            </h1>
            <p className="text-xl max-w-4xl mx-auto" style={{ color: COLORS.cadetGray }}>
                An innovative crowdsourcing platform building the future of AI for India. By contributing your voice, you enhance our datasets, earn rewards, and help create technology that understands every Indian language.
            </p>
        </motion.div>

        <div className="relative">
            <div className="hidden md:block absolute top-0 h-full w-[2px] left-1/2 -translate-x-1/2" style={{ background: `linear-gradient(to bottom, transparent, ${COLORS.teaGreen}30, transparent)`}}></div>
            {timelineSections.map((section, index) => {
                const isLeft = index % 2 === 0;
                return (
                    <motion.div
                        key={index}
                        className="relative flex items-center mb-12 md:mb-0"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.5 }}
                    >
                        <div className="hidden md:flex justify-between items-center w-full">
                           {isLeft ? (
                                <motion.div className="w-5/12" variants={cardVariants.left}>
                                    <Card content={section} />
                                </motion.div>
                           ) : <div className="w-5/12"></div>}

                           <div className="z-10 flex items-center justify-center w-12 h-12 rounded-full" style={{ background: COLORS.midnightGreen, border: `2px solid ${COLORS.teaGreen}` }}>
                                <span style={{ color: COLORS.teaGreen }}>{section.icon}</span>
                           </div>

                           {!isLeft ? (
                               <motion.div className="w-5/12" variants={cardVariants.right}>
                                   <Card content={section} />
                               </motion.div>
                           ) : <div className="w-5/12"></div>}
                        </div>
                        <div className="md:hidden flex items-center w-full">
                            <div className="flex-shrink-0 z-10 mr-6">
                                <div className="relative">
                                    <div className="absolute top-full h-screen w-[2px] -translate-x-1/2 left-1/2" style={{background: `linear-gradient(to bottom, ${COLORS.teaGreen}30 10%, transparent)`}}></div>
                                    <div className="flex items-center justify-center w-12 h-12 rounded-full" style={{ background: COLORS.midnightGreen, border: `2px solid ${COLORS.teaGreen}` }}>
                                      <span style={{ color: COLORS.teaGreen }}>{section.icon}</span>
                                    </div>
                                </div>
                            </div>
                            <motion.div className="w-full" variants={cardVariants.right}>
                               <Card content={section} />
                            </motion.div>
                        </div>
                    </motion.div>
                );
            })}
        </div>
      </div>
  );
};

export default AboutDhvaniShilpContent;