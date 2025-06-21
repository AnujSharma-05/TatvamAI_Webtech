import { ReactNode, CSSProperties } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MotionProviderProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export const MotionProvider = ({ children, className = "", style }: MotionProviderProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`${className}`}
      style={style}
    >
      {children}
    </motion.div>
  );
};

// Motion components for different animation types
export const MotionDiv = ({ children, className = "", delay = 0, style }: { children: ReactNode; className?: string; delay?: number; style?: CSSProperties }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.1 }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
};

export const MotionCard = ({ children, className = "", style }: { children: ReactNode; className?: string; style?: CSSProperties }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
};

export const MotionButton = ({ children, className = "", style, ...props }: { children: ReactNode; className?: string; style?: CSSProperties; [key: string]: any }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      className={className}
      style={style}
      {...props}
    >
      {children}
    </motion.button>
  );
}; 