import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { InView } from 'react-intersection-observer';

const About = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  const sections = [
    {
      title: null,
      content:
        'At Tatvam AI, we are dedicated to empowering Indian languages through the transformative potential of voice technology. Our mission is to bring the rich linguistic diversity of India into the forefront of voice-enabled AI, ensuring that every voice, in every Indian language, is heard and understood.',
    },
    {
      title: 'Who We Are',
      content:
        'Tatvam AI is a passionate team of innovators, linguists, and data experts united by a vision to make voice technology inclusive for India’s diverse linguistic heritage.',
    },
    {
      title: 'What We Do',
      content:
        'Our platform is a hub for collecting high-quality voice data in Indian languages to preserve and promote their unique sounds, accents, and nuances.',
    },
    {
      title: 'Why It Matters',
      content:
        'India is home to over 1,600 languages and dialects, yet many remain underrepresented in modern technology.',
    },
    {
      title: 'Join Us',
      content:
        'Your voice is a vital part of India’s linguistic tapestry. Join us in celebrating and preserving India’s voices, one language at a time.',
    },
  ];

  return (
    <div
      ref={containerRef}
      className="relative bg-slate-900 text-white min-h-screen py-24 overflow-x-hidden"
    >
      {/* Floating Ambient Glows */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute w-72 h-72 bg-blue-500 blur-3xl rounded-full opacity-20 top-20 left-10 animate-pulse" />
        <div className="absolute w-96 h-96 bg-purple-500 blur-3xl rounded-full opacity-20 bottom-0 right-0 animate-ping" />
      </div>

      {/* Animated Heading */}
      <motion.h1
        className="text-5xl md:text-6xl font-extrabold text-center pl-4 sm:pl-10 mb-24 glow-hover"
        style={{ scale, opacity }}
      >
        About Tatvam AI
      </motion.h1>

      {/* Animated Sections */}
      <div className="max-w-5xl mx-auto space-y-32 px-4 sm:px-8">
        {sections.map((section, index) => (
          <InView triggerOnce threshold={0.2} key={index}>
            {({ inView, ref }) => (
              <motion.section
                ref={ref}
                initial={{ opacity: 0, x: -100, scale: 0.98 }}
                animate={
                  inView
                    ? { opacity: 1, x: 0, scale: 1 }
                    : { opacity: 0, x: -100, scale: 0.98 }
                }
                transition={{
                  type: 'spring',
                  stiffness: 60,
                  damping: 20,
                  delay: 0.6 * index,
                }}
                className="prose prose-lg prose-invert max-w-3xl glow-hover"
              >
                {section.title && (
                  <h2 className="font-semibold underline-grow">{section.title}</h2>
                )}
                <p>{section.content}</p>
              </motion.section>
            )}
          </InView>
        ))}
      </div>
    </div>
  );
};

export default About;
