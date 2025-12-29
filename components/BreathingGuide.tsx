import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';

interface BreathingGuideProps {
  onComplete: () => void;
}

export const BreathingGuide: React.FC<BreathingGuideProps> = ({ onComplete }) => {
  const [text, setText] = useState('Just breathe.');
  const timersRef = useRef<NodeJS.Timeout[]>([]);
  const completedRef = useRef(false);
  
  const handleComplete = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    // Clear all pending timers
    timersRef.current.forEach(timer => clearTimeout(timer));
    timersRef.current = [];
    onComplete();
  }, [onComplete]);

  useEffect(() => {
    const cycleDuration = 8000;
    
    // Timer 1: Start inhale
    const t1 = setTimeout(() => {
      setText('Inhale...');
    }, 1000);
    
    // Timer 2: Exhale
    const t2 = setTimeout(() => {
      setText('Exhale...');
    }, 1000 + cycleDuration / 2);
    
    // Timer 3: Auto complete
    const t3 = setTimeout(() => {
      handleComplete();
    }, 1000 + cycleDuration);
    
    timersRef.current = [t1, t2, t3];

    return () => {
      timersRef.current.forEach(timer => clearTimeout(timer));
    };
  }, [handleComplete]);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center z-30">
      <motion.div
        animate={{
          scale: [1, 1.8, 1],
          opacity: [0.3, 0.8, 0.3],
        }}
        transition={{
          duration: 8,
          ease: "easeInOut",
          repeat: 0, 
        }}
        className="w-48 h-48 rounded-full border-2 border-orange-100/30 bg-orange-500/5 blur-xl absolute"
      />
      
      {/* Sharp Ring */}
      <motion.div
        animate={{
          scale: [1, 1.5, 1],
          borderColor: ["rgba(255,255,255,0.2)", "rgba(255,200,150,0.6)", "rgba(255,255,255,0.2)"]
        }}
        transition={{
          duration: 8,
          ease: "easeInOut",
          repeat: 0,
        }}
        className="w-48 h-48 rounded-full border border-orange-50/20 relative flex items-center justify-center"
      >
          <div className="w-1 h-1 bg-white rounded-full shadow-[0_0_10px_2px_rgba(255,255,255,0.8)]" />
      </motion.div>

      <motion.h2 
        key={text}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.5 }}
        className="mt-16 font-serif italic text-3xl text-orange-50/80 tracking-widest"
      >
        {text}
      </motion.h2>
      
      {/* Skip Button - visible immediately */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        onClick={handleComplete}
        className="mt-12 text-white/40 hover:text-white/70 transition-colors duration-300 font-sans text-sm tracking-widest uppercase"
      >
        Skip →
      </motion.button>
    </div>
  );
};