import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface RecordingTimerProps {
  maxDuration: number; // in seconds
  onComplete: () => void;
}

export const RecordingTimer = ({ maxDuration, onComplete }: RecordingTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(maxDuration);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    if (!isRecording) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onComplete();
          setIsRecording(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRecording, onComplete]);

  const startRecording = () => {
    setTimeLeft(maxDuration);
    setIsRecording(true);
  };

  const stopRecording = () => {
    setIsRecording(false);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <motion.div
        animate={{
          scale: isRecording ? [1, 1.1, 1] : 1,
        }}
        transition={{
          duration: 1,
          repeat: isRecording ? Infinity : 0,
        }}
        className="text-2xl font-bold"
      >
        {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
      </motion.div>
      <div className="relative">
        <motion.div
          animate={{
            scale: isRecording ? [1, 1.2, 1] : 1,
            opacity: isRecording ? [1, 0.5, 1] : 1,
          }}
          transition={{
            duration: 1,
            repeat: isRecording ? Infinity : 0,
          }}
          className="absolute -inset-2 bg-red-500 rounded-full opacity-25"
        />
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={`relative px-6 py-3 rounded-full font-semibold text-white transition-colors ${
            isRecording
              ? 'bg-red-500 hover:bg-red-600'
              : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </button>
      </div>
      <AnimatePresence>
        {isRecording && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-sm text-gray-500"
          >
            Recording in progress...
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}; 