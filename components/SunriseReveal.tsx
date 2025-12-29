import React from 'react';
import { motion } from 'framer-motion';

interface SunriseRevealProps {
  onRestart?: () => void;
}

export const SunriseReveal: React.FC<SunriseRevealProps> = ({ onRestart }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, ease: "easeOut" }}
      className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-gradient-to-t from-[#632c65] via-[#2b1055] to-[#030303]"
    >
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30" />
      
      {/* Sun/Horizon Light */}
      <motion.div 
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, duration: 2, ease: "easeOut" }}
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[150vw] h-[50vh] bg-gradient-to-t from-[#ff9a9e] to-transparent opacity-40 blur-[100px] pointer-events-none"
      />

      <div className="relative z-10 text-center px-6">
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="font-serif italic text-4xl md:text-6xl text-white mb-6 leading-tight"
        >
          You made space.
        </motion.h1>
        
        <motion.h2 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="font-sans font-bold text-6xl md:text-9xl text-transparent bg-clip-text bg-gradient-to-b from-white to-white/70 tracking-tighter"
        >
          2026
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3, duration: 0.8 }}
          className="font-sans text-white/50 mt-4 tracking-widest uppercase text-sm"
        >
          is yours
        </motion.p>

        <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ delay: 4, duration: 0.8 }}
           className="mt-16 flex flex-col gap-4 items-center"
        >
            <button className="text-white/60 hover:text-white transition-colors duration-300 font-serif italic border-b border-white/30 hover:border-white/80 pb-2 text-2xl tracking-wide">
                Save this horizon
            </button>
            
            {onRestart && (
              <button 
                onClick={onRestart}
                className="text-white/40 hover:text-white/70 transition-colors duration-300 font-sans text-sm tracking-widest uppercase mt-4"
              >
                ↻ Start Again
              </button>
            )}
        </motion.div>
      </div>
    </motion.div>
  );
};