import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Mic, Globe, Users, Award, ChevronRight, Play, QrCode, Hexagon, Coins, ShieldCheck, UserX } from "lucide-react"; // <-- Added new icons
import { COLORS } from '@/config/theme';
import AboutDhvaniShilpContent from '@/components/AboutDhvaniShilpContent';

// --- HeroSlide, AnimatedSlide, Card, HorizontalMarquee components remain unchanged ---
const HeroSlide = ({ scrollYProgress, onNavigate }) => {
  // Very strict fade-out: only fade at the very end (from 12% to 15%)
  const opacity = useTransform(scrollYProgress, [0, 0.12, 0.15], [1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.2], [0, '-50vh']);
  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.2 } } };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } } };
  return ( 
          <motion.div style={{ y, opacity, zIndex: 10 }} className="w-full h-full absolute flex items-center justify-center text-center px-6"> <motion.div variants={containerVariants} initial="hidden" animate="visible" className="max-w-4xl"> <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl lg:text-8xl font-extrabold mb-6 leading-tight" style={{ color: COLORS.nyanza, textShadow: `0 0 30px ${COLORS.teaGreen}30` }}> Your Voice <span style={{ color: COLORS.teaGreen }}>Shapes AI</span> </motion.h1> <motion.p variants={itemVariants} className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto" style={{ color: COLORS.cadetGray }}> Join the world's largest voice contribution platform. Help build inclusive AI that understands everyone. </motion.p> <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center items-center"> <button onClick={() => onNavigate("/qr-recording")} className="flex items-center px-8 py-5 text-lg font-semibold rounded-full shadow-lg transition-transform transform hover:scale-105" style={{ background: COLORS.teaGreen, color: COLORS.midnightGreen }}> <Play className="w-5 h-5 mr-2" /> Start Contributing </button> <button onClick={() => onNavigate("/qr")} className="flex items-center px-8 py-5 text-lg font-semibold rounded-full transition-transform transform hover:scale-105" style={{ border: `1px solid ${COLORS.cadetGray}80`, color: COLORS.cadetGray, background: `${COLORS.midnightGreen}30`, backdropFilter: 'blur(5px)' }}> <QrCode className="w-5 h-5 mr-2" /> Explore Dhvani-Shilp </button> </motion.div> </motion.div> </motion.div> );
};

const AnimatedSlide = ({ scrollYProgress, children, range }) => {
  const start = range[0], end = range[1], mid = start + (end - start) / 2;
  const y = useTransform(scrollYProgress, [start, mid, end], ['50vh', '0vh', '-50vh']);
  // Very strict fade: minimal fade-in/out zones for maximum visibility
  const fadeInEnd = start + 0.015; // Only 1.5% for fade-in
  const fadeOutStart = end - 0.015; // Only 1.5% for fade-out
  const opacity = useTransform(scrollYProgress, [start, fadeInEnd, fadeOutStart, end], [0, 1, 1, 0]);
  const pointerEvents = useTransform(scrollYProgress, (pos) => (pos >= start && pos <= end ? 'auto' : 'none'));
  return ( <motion.div style={{ y, opacity, pointerEvents }} className="w-full h-full absolute flex items-center justify-center px-6"> {children} </motion.div> );
};

const Card = ({ children, className = '' }) => ( <div className={`w-full max-w-6xl p-8 md:p-12 rounded-2xl ${className}`}> {children} </div> );

const HorizontalMarquee = ({ features }) => {
  const marqueeVariants = { animate: { x: [0, -1088], transition: { x: { repeat: Infinity, repeatType: "loop", duration: 20, ease: "linear" } } } };
  return ( <div className="w-full overflow-hidden whitespace-nowrap"> <motion.div className="inline-block" variants={marqueeVariants} animate="animate"> {[...features, ...features].map((feature, index) => ( <span key={index} className="inline-flex items-center mx-8 text-2xl font-semibold" style={{ color: COLORS.cadetGray }}> <span className="mr-4 p-3 rounded-full" style={{ background: `${COLORS.teaGreen}20`, color: COLORS.teaGreen }}>{feature.icon}</span> {feature.title} </span> ))} </motion.div> </div> );
};

const DhvaniShilp = () => {
  const navigate = useNavigate();
  const scrollRef = React.useRef(null);

  const { scrollYProgress } = useScroll({ target: scrollRef, offset: ["start start", "end end"] });
  const progressBarScaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const features = [
    { icon: <Mic size={24}/>, title: "Voice Contribution" },
    { icon: <Globe size={24}/>, title: "Multilingual Support" },
    { icon: <Users size={24}/>, title: "Community Driven" },
    { icon: <Award size={24}/>, title: "Earn Rewards" },
  ];

  return (
      // STEP 2: INCREASED HEIGHT
      <div ref={scrollRef} style = {{ height: '600vh', background: 'transparent' }} >
        <div className="sticky top-0 h-screen overflow-hidden">
          
          {/* <div className="absolute inset-0 w-full h-full pointer-events-none">
            <div className="absolute w-[40vw] h-[40vw] rounded-full filter blur-3xl opacity-20 revolve-1" style={{ backgroundColor: COLORS.teaGreen }} />
            <div className="absolute w-[30vw] h-[30vw] rounded-full filter blur-3xl opacity-15 revolve-2" style={{ backgroundColor: COLORS.cadetGray }} />
            <div className="absolute w-[25vw] h-[25vw] rounded-full filter blur-2xl opacity-10 revolve-3" style={{ backgroundColor: COLORS.lightYellow }} />
          </div> */}
          
          <motion.div className="absolute top-0 left-0 right-0 h-1 origin-left z-50" style={{ scaleX: progressBarScaleX, background: COLORS.teaGreen }} />

          <HeroSlide scrollYProgress={scrollYProgress} onNavigate={navigate} />

          {/* --- STEP 3: ADJUSTED RANGES FOR ALL SLIDES --- */}
          <AnimatedSlide scrollYProgress={scrollYProgress} range={[0.15, 0.30]}>
              <AboutDhvaniShilpContent />
          </AnimatedSlide>

          <AnimatedSlide scrollYProgress={scrollYProgress} range={[0.32, 0.47]}>
              <Card>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center w-full text-left">
                      <div>
                          <h2 className="text-3xl font-bold mb-4" style={{ color: COLORS.nyanza }}>The Digital Divide is a Language Barrier</h2>
                          <p className="text-lg leading-relaxed" style={{ color: COLORS.cadetGray }}>
                              <strong>665 million Indians</strong> still lack internet access...
                          </p>
                          <p className="mt-4 text-lg" style={{ color: COLORS.teaGreen }}>
                              Voice is the most intuitive bridge...
                          </p>
                      </div>
                      <div className='text-center md:text-left'>
                          <h2 className="text-3xl font-bold mb-6" style={{ color: COLORS.nyanza }}>How We're Bridging It</h2>
                          <div className="space-y-6">
                              <div><p className="text-5xl font-bold" style={{ color: COLORS.teaGreen }}>10+ hrs+</p><p className="text-md uppercase tracking-wider" style={{ color: COLORS.cadetGray }}>Voice Samples</p></div>
                              <div><p className="text-5xl font-bold" style={{ color: COLORS.teaGreen }}>10+</p><p className="text-md uppercase tracking-wider" style={{ color: COLORS.cadetGray }}>Languages & Dialects Covered</p></div>
                              <div><p className="text-5xl font-bold" style={{ color: COLORS.teaGreen }}>500+</p><p className="text-md uppercase tracking-wider" style={{ color: COLORS.cadetGray }}>Contributors Empowered</p></div>
                          </div>
                      </div>
                  </div>
              </Card>
          </AnimatedSlide>


          <AnimatedSlide scrollYProgress={scrollYProgress} range={[0.49, 0.64]}>
              <Card>
                  <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center" style={{ color: COLORS.nyanza, textShadow: `0 0 20px ${COLORS.teaGreen}20` }}>
                      Key Features
                  </h2>
                  <HorizontalMarquee features={features} />
              </Card>
          </AnimatedSlide>
          
          <AnimatedSlide scrollYProgress={scrollYProgress} range={[0.66, 0.81]}>
              <Card>
                  <motion.div className="w-full" initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.2 }} variants={{ visible: { transition: { staggerChildren: 0.15 } } }}>
                      <motion.h2 variants={{hidden: {opacity: 0, y: 20}, visible: {opacity: 1, y: 0}}} className="text-center text-4xl md:text-5xl font-bold mb-16" style={{ color: COLORS.nyanza, textShadow: `0 0 20px ${COLORS.teaGreen}20` }}>
                          Powering Real-World Applications
                      </motion.h2>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                          <motion.div variants={{hidden: {opacity: 0, y: 20}, visible: {opacity: 1, y: 0}}} className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${COLORS.cadetGray}20`}}>
                              <img src="/logo.png" alt="Smarter Assistants" className="w-full h-48 object-cover opacity-50"/>
                              <div className="p-6 text-left" style={{background: `linear-gradient(145deg, ${COLORS.midnightGreen}, #002a35)`}}>
                                  <h3 className="text-xl font-bold" style={{color: COLORS.nyanza}}>Smarter Assistants</h3>
                                  <p className="mt-2" style={{color: COLORS.cadetGray}}>Enabling voice assistants to understand diverse accents and local dialects.</p>
                                </div>
                          </motion.div>
                          <motion.div variants={{hidden: {opacity: 0, y: 20}, visible: {opacity: 1, y: 0}}} className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${COLORS.cadetGray}20`}}>
                              <img src="/logo.png" alt="Accessible Technology" className="w-full h-48 object-cover opacity-50"/>
                              <div className="p-6 text-left" style={{background: `linear-gradient(145deg, ${COLORS.midnightGreen}, #002a35)`}}>
                                  <h3 className="text-xl font-bold" style={{color: COLORS.nyanza}}>Accessible Technology</h3>
                                  <p className="mt-2" style={{color: COLORS.cadetGray}}>Creating tools for literacy and accessibility for underserved communities.</p>
                              </div>
                          </motion.div>
                          <motion.div variants={{hidden: {opacity: 0, y: 20}, visible: {opacity: 1, y: 0}}} className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${COLORS.cadetGray}20`}}>
                              <img src="/logo.png" alt="In-Car Voice Control" className="w-full h-48 object-cover opacity-50"/>
                              <div className="p-6 text-left" style={{background: `linear-gradient(145deg, ${COLORS.midnightGreen}, #002a35)`}}>
                                  <h3 className="text-xl font-bold" style={{color: COLORS.nyanza}}>In-Car Voice Control</h3>
                                  <p className="mt-2" style={{color: COLORS.cadetGray}}>Improving hands-free systems for navigation, making driving safer for everyone.</p>
                              </div>
                          </motion.div>
                      </div>
                  </motion.div>
              </Card>
          </AnimatedSlide>

          <AnimatedSlide scrollYProgress={scrollYProgress} range={[0.83, 1.0]}>
              <div className="w-full max-w-4xl text-center">
                  <div className="p-10 md:p-16 rounded-3xl" style={{ background: `linear-gradient(135deg, ${COLORS.teaGreen} -20%, ${COLORS.midnightGreen} 60%)`, boxShadow: `0 8px 40px ${COLORS.teaGreen}10` }}>
                      <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: COLORS.nyanza, textShadow: `0 0 20px ${COLORS.nyanza}30` }}>Ready to Make a Difference?</h2>
                      <p className="text-xl mb-10 max-w-2xl mx-auto" style={{ color: COLORS.cadetGray }}>
                          Your voice matters. Join our community and help build the future of AI.
                      </p>
                      <button onClick={() => navigate("/signin")} className="flex items-center mx-auto px-10 py-5 text-xl font-bold rounded-full shadow-xl hover:shadow-2xl transition-transform transform hover:scale-105" style={{ background: COLORS.nyanza, color: COLORS.midnightGreen }}>
                          Get Started Now <ChevronRight className="w-6 h-6 ml-2" />
                      </button>
                  </div>
              </div>
          </AnimatedSlide>

        </div>
      </div>
  );
};

export default DhvaniShilp;