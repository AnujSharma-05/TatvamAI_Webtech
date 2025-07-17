import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { InView } from 'react-intersection-observer';

const About = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const headingScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const headingOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  const sections = [
    {
      title: null,
      content:
        'At Tatvam AI, we are dedicated to empowering Indian languages through the transformative potential of voice technology. Our mission is to bring the rich linguistic diversity of India into the forefront of voice-enabled AI, ensuring that every voice, in every Indian language, is heard and understood.',
      image: '/logo.png',
    },
    {
      title: 'Who We Are',
      content:
        'Tatvam AI is a passionate team of innovators, linguists, and data experts united by a vision to make voice technology inclusive for India’s diverse linguistic heritage.',
      image: '/logo.png',
    },
    {
      title: 'What We Do',
      content:
        'Our platform is a hub for collecting high-quality voice data in Indian languages to preserve and promote their unique sounds, accents, and nuances.',
      image: '/logo.png',
    },
    {
      title: 'Why It Matters',
      content:
        'India is home to over 1,600 languages and dialects, yet many remain underrepresented in modern technology.',
      image: '/logo.png',
    },
    {
      title: 'Join Us',
      content:
        'Your voice is a vital part of India’s linguistic tapestry. Join us in celebrating and preserving India’s voices, one language at a time.',
      image: '/logo.png',
    },
  ];

  return (
    <div
      ref={containerRef}
      className="relative bg-slate-900 text-white min-h-screen py-24 px-6 overflow-x-hidden"
    >
      {/* Ambient Glows */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute w-96 h-96 bg-blue-500 blur-[140px] rounded-full top-10 left-10 opacity-20 animate-slow-bounce" />
        <div className="absolute w-[600px] h-[600px] bg-white blur-[180px] rounded-full bottom-0 right-0 opacity-20 animate-pulse" />
      </div>

      {/* Heading
      <motion.h1
        style={{ scale: headingScale, opacity: headingOpacity }}
        className="text-5xl md:text-7xl font-black absolute left-0 -bottom-1 h-[2px] w-0 bg-blue-500 transition-all duration-500 group-hover:w-40"
      >
        About Tatvam AI
      </motion.h1> */}

      {/* Sections */}
      <div className="space-y-28 max-w-6xl mx-auto">
        {sections.map((section, index) => (
          <InView key={index} triggerOnce threshold={0.3}>
            {({ inView, ref }) => (
              <motion.div
                ref={ref}
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                animate={
                  inView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 50, scale: 0.95 }
                }
                transition={{
                  duration: 0.8,
                  ease: 'easeOut',
                  delay: index * 0.2,
                }}
                className={`flex flex-col md:flex-row ${
                  index % 2 === 0 ? '' : 'md:flex-row-reverse'
                } items-center gap-10`}
              >
                {/* Text Content */}
                <div className="md:w-1/2 h-full">
                  <motion.div
                    className="bg-[#101729] border border-slate-700/50 rounded-2xl p-8 shadow-lg hover:shadow-purple-500/30 transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                  >
                    {section.title && (
                      <h2 className="text-4xl font-semibold mb-4 text-white tracking-wide group relative inline-block">
                        {section.title}
                        <span className = "absolute left-0 -bottom-1 h-[2px] w-0 bg-blue-500 transition-all duration-500 group-hover:w-40"></span>
                      </h2>
                    )}
                    <p className="text-lg text-slate-300 leading-relaxed">{section.content}</p>
                  </motion.div>
                </div>

                {/* Dynamic Image */}
                <div className="md:w-1/2">
                  <motion.div
                    className="w-full h-64 rounded-2xl bg-gradient-to-tr from-[#1e293b] via-[#111827] to-[#1e293b] shadow-inner border border-slate-700/30 overflow-hidden"
                    whileHover={{ scale: 1.01 }}
                  >
                    <img
                      src={section.image}
                      alt={section.title || 'Tatvam AI'}
                      className="h-full w-full object-contain p-4"
                    />
                  </motion.div>
                </div>
              </motion.div>
            )}
          </InView>
        ))}
      </div>
    </div>
  );
};

export default About;
