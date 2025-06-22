import { motion } from 'framer-motion';

interface LoadingProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  text?: string;
}

export const Loading = ({
  size = 'medium',
  color = 'indigo',
  text = 'Loading...',
}: LoadingProps) => {
  const sizes = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
  };

  const colors = {
    indigo: 'border-indigo-600',
    blue: 'border-blue-600',
    red: 'border-red-600',
    green: 'border-green-600',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <motion.div
        className={`${sizes[size]} border-4 rounded-full ${colors[color as keyof typeof colors]} border-t-transparent`}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
      {text && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-gray-600 text-sm"
        >
          {text}
        </motion.p>
      )}
    </div>
  );
}; 