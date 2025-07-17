import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Documentation = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white py-24 px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto text-center"
      >
        <h1 className="text-4xl font-bold mb-6">Documentation</h1>
        <p className="text-lg text-slate-300 mb-4">
          Our technical documentation is currently under development and will be available shortly.
        </p>
        <p className="text-md text-slate-400 mb-8">
          It will include comprehensive guides, integration instructions, and detailed references for all our offerings — including Automatic Speech Recognition (ASR), Text-to-Speech (TTS), and real-time voice intelligence APIs. These resources will assist both developers and enterprises in seamlessly adopting TatvamAI's voice technology to enhance productivity and accessibility across use cases.
        </p>
        <Link
          to="/products"
          className="inline-block px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-700 transition duration-300 shadow-lg"
        >
          Explore Our Products
        </Link>
      </motion.div>
    </div>
  );
};

export default Documentation;
