import { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { InView } from 'react-intersection-observer';

const Blogs = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const headingScale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);
  const headingOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  const blogs = [
    {
      title: 'The Future of Voice Technology in India',
      link: 'https://example.com/blog1',
      excerpt: 'Exploring how voice technology is transforming digital interactions in India...',
      author: 'Rahul Kumar',
      date: 'March 15, 2024',
      category: 'Technology',
    },
    {
      title: 'Building Inclusive Voice Datasets',
      link: 'https://example.com/blog2',
      excerpt: 'Understanding the importance of diverse voice data collection...',
      author: 'Priya Singh',
      date: 'March 12, 2024',
      category: 'Research',
    },
    {
      title: 'Voice AI in Regional Languages',
      link: 'https://example.com/blog3',
      excerpt: 'Breaking down language barriers with advanced voice recognition...',
      author: 'Arun Patel',
      date: 'March 10, 2024',
      category: 'Innovation',
    },
    {
      title: 'How to Collect Data Ethically',
      link: 'https://example.com/blog4',
      excerpt: 'Ethical considerations in crowd-based voice data collection...',
      author: 'Ananya Rao',
      date: 'March 7, 2024',
      category: 'Ethics',
    },
    {
      title: 'Tatvam AI Research Methodology',
      link: 'https://example.com/blog5',
      excerpt: 'A glimpse into how we structure and validate our multilingual datasets...',
      author: 'Deepak Nair',
      date: 'March 4, 2024',
      category: 'Methodology',
    },
  ];

  return (
    <div
      ref={containerRef}
      className="relative bg-slate-900 text-white min-h-screen py-24 px-6 overflow-x-hidden before:absolute before:inset-0 before:bg-gradient-to-tr before:from-blue-900/10 before:to-purple-900/10 before:animate-slow-pulse before:z-[-1]"
    >
      {/* Glows */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute w-96 h-96 bg-blue-500 blur-[140px] rounded-full top-10 left-10 opacity-20 animate-slow-bounce" />
        <div className="absolute w-[600px] h-[600px] bg-purple-500 blur-[180px] rounded-full bottom-0 right-0 opacity-20 animate-ping" />
      </div>

      {/* Heading */}
      <motion.h1
        style={{ scale: headingScale, opacity: headingOpacity }}
        className="text-5xl md:text-6xl font-black text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-white mb-24"
      >
        Latest Blog Posts
      </motion.h1>

      {/* Blog rows */}
      <div className="space-y-24 max-w-6xl mx-auto">
        {blogs.reduce((rows: any[], blog, index) => {
          if (index % 2 === 0) rows.push([blog]);
          else rows[rows.length - 1].push(blog);
          return rows;
        }, []).map((pair, rowIndex) => (
          <div
            key={rowIndex}
            className="flex flex-col md:flex-row gap-9"
          >
            {pair.map((blog, colIndex) => {
              const isLeftWide = rowIndex % 2 === 0;
              const wideCol = colIndex === 0 ? isLeftWide : !isLeftWide;

              const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

              const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
                const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
                setMousePos({
                  x: (e.clientX - left - width / 2) / 10,
                  y: -(e.clientY - top - height / 2) / 20,
                });
              };

              return (
                <InView key={colIndex} triggerOnce threshold={0.2}>
                  {({ inView, ref }) => (
                    <motion.div
                      ref={ref}
                      initial={{ opacity: 0, y: 50, scale: 0.95 }}
                      animate={
                        inView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 50, scale: 0.95 }
                      }
                      transition={{ duration: 0.8, delay: rowIndex * 0.2 }}
                      className={`${wideCol ? 'md:w-2/3' : 'md:w-1/3'} w-full`}
                    >
                      <motion.div
                        onMouseMove={handleMouseMove}
                        onMouseLeave={() => setMousePos({ x: 0, y: 0 })}
                        style={{
                          rotateX: mousePos.y,
                          rotateY: mousePos.x,
                        }}
                        className="relative group cursor-pointer"
                      >
                        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-30 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 blur-md transition-opacity duration-500 pointer-events-none" />
                        <div className="relative z-10 bg-[#101729] border border-slate-700/50 rounded-2xl p-8 shadow-xl transition-all duration-300 h-[18rem] flex flex-col justify-between">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-blue-400">{blog.category}</span>
                            <span className="text-sm text-slate-500">{blog.date}</span>
                          </div>
                          <a
                            href={blog.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xl md:text-2xl font-bold text-white relative group inline-block"
                          >
                            {blog.title}
                            <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-blue-500 transition-all duration-500 group-hover:w-40"></span>
                          </a>
                          <p className="text-slate-300 mt-3 mb-5">{blog.excerpt}</p>
                          <div className="flex items-center text-sm text-slate-400">
                            <div className="w-8 h-8 rounded-full bg-slate-600 mr-3" />
                            {blog.author}
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </InView>
              );
            })}
            {pair.length === 1 && (
              <div className="md:w-1/3 hidden md:block" />
            )}
          </div>
        ))}
      </div>

      {/* CTA Button */}
      <InView triggerOnce threshold={0.5}>
        {({ inView, ref }) => (
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.0 }}
            className="mt-24 text-center"
          >
            {/* <a
              href="https://tatvam.ai/blogs"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium px-6 py-3 rounded-xl shadow-lg hover:scale-105 transition-transform"
            >
              View More Blogs →
            </a> */}
          </motion.div>
        )}
      </InView>
    </div>
  );
};

export default Blogs;
