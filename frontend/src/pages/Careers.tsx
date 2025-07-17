import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Careers = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white py-24 px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto text-center"
      >
        <h1 className="text-4xl font-bold mb-6">Careers</h1>
        <p className="text-lg text-slate-300 mb-4">
          Welcome to the Careers section of TatvamAI. We're excited about the possibility of you joining our journey.
        </p>
        <p className="text-md text-slate-400 mb-8">
          All the latest career opportunities, updates, and hiring announcements will be posted here. Stay tuned for roles across engineering, research, design, and operations as we grow our mission-driven team.
        </p>
        <p className="text-md text-slate-400 mb-8">
          If you have any questions or wish to reach out, feel free to get in touch with us directly.
        </p>
        <Link
          to="/contact"
          className="inline-block px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-700 transition duration-300 shadow-lg"
        >
          Contact Us
        </Link>
      </motion.div>
    </div>
  );
};

export default Careers;
