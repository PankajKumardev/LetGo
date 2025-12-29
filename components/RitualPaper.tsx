import React, { useState, useEffect } from 'react';
import { motion, PanInfo, useAnimation } from 'framer-motion';

interface RitualPaperProps {
  onBurn: () => void;
  onDragProgress: (distanceRatio: number) => void;
}

export const RitualPaper: React.FC<RitualPaperProps> = ({ onBurn, onDragProgress }) => {
  const [text, setText] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [charLevel, setCharLevel] = useState(0);
  const controls = useAnimation();
  
  // Calculate window dimensions safely
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  
  useEffect(() => {
    const handleResize = () => setWindowHeight(window.innerHeight);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Keyboard shortcut: Enter to burn (when text exists)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && e.ctrlKey && text.trim().length > 0) {
        onBurn();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [text, onBurn]);

  const handleDrag = (_: any, info: PanInfo) => {
    const y = info.point.y;
    
    // Normalize ratio: Start effect halfway down
    const startEffect = windowHeight * 0.3;
    const ratio = Math.max(0, Math.min(1, (y - startEffect) / (windowHeight - startEffect)));
    
    setCharLevel(ratio);
    onDragProgress(ratio);
  };

  const handleDragEnd = (_: any, info: PanInfo) => {
    setIsDragging(false);
    const y = info.point.y;
    
    // If dropped in fire zone (bottom 200px)
    if (y > windowHeight - 200) {
      // Haptic feedback on mobile
      if (navigator.vibrate) {
        navigator.vibrate([50, 30, 100]);
      }
      onBurn();
    } else {
      // Snap back if not burned
      controls.start({ x: 0, y: 0, rotate: 0, transition: { type: "spring", stiffness: 200, damping: 20 } });
      setCharLevel(0);
      onDragProgress(0);
    }
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20 px-4">
      <motion.div
        drag
        dragElastic={0.15}
        dragConstraints={{ top: -150, left: -150, right: 150, bottom: 350 }}
        dragMomentum={false}
        dragTransition={{ bounceStiffness: 300, bounceDamping: 20 }}
        animate={controls}
        onDragStart={() => setIsDragging(true)}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        whileHover={{ scale: 1.01, rotate: 0.5 }}
        whileTap={{ scale: 0.98, cursor: "grabbing" }}
        className={`pointer-events-auto relative w-full max-w-md aspect-[3/4] md:w-[26rem] md:h-[34rem] bg-[#e8e6e1] shadow-2xl cursor-grab touch-none ${isDragging ? 'cursor-grabbing' : ''}`}
        style={{
          borderRadius: '2px',
        }}
      >
        {/* Paper Texture Overlay */}
        <div className="absolute inset-0 opacity-40 mix-blend-multiply pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cardboard-flat.png')]" />
        
        {/* Charring Overlay (Top Layer) */}
        <div 
          className="absolute inset-0 pointer-events-none transition-opacity duration-75 z-20 rounded-sm"
          style={{
            background: `radial-gradient(circle at bottom, rgba(0,0,0,${charLevel * 1.8}) 0%, rgba(68, 20, 0, ${charLevel * 0.9}) 30%, transparent 80%)`,
            opacity: charLevel > 0 ? 1 : 0
          }}
        />
        
        {/* Charring Edges */}
         <div 
           className="absolute inset-0 pointer-events-none border-x-4 border-b-4 border-transparent transition-all duration-75 z-20"
           style={{
             borderColor: charLevel > 0.5 ? `rgba(50,50,50,${charLevel})` : 'transparent',
             filter: 'blur(4px)'
           }}
        />

        {/* Content Container */}
        <div className="relative z-10 h-full flex flex-col items-center px-8 pt-12 pb-6">
            
            {/* Header / Prompt */}
            <h1 className="font-serif italic text-3xl text-[#2c2c2c] mb-8 mt-4 tracking-wide text-center">
              Write it down. Leave it here.
            </h1>

            {/* Writing Area */}
            <div className="flex-grow w-full relative">
               <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type here..."
                className="w-full h-full bg-transparent resize-none border-none outline-none font-hand text-3xl text-gray-800 leading-loose placeholder:text-gray-300 placeholder:font-hand text-center selection:bg-gray-300/50 touch-auto"
                spellCheck={false}
              />
            </div>
            
            {/* Footer */}
            <div className="w-full mt-auto pt-6 flex flex-col items-center gap-3">
                {/* Divider Line */}
                <div className="w-full h-px bg-[#a09e98]" />
                
                {/* Instruction */}
                <span className="font-serif text-sm tracking-[0.2em] text-[#888] uppercase opacity-70">
                  Drag to the fire below
                </span>
                
                {/* Keyboard hint */}
                <span className="font-sans text-xs text-[#aaa] opacity-50 hidden md:block">
                  or press Ctrl+Enter
                </span>
            </div>
        </div>
      </motion.div>
      
      {/* Privacy Notice - Top */}
      <div className="absolute top-4 left-0 right-0 text-center pointer-events-none">
        <span className="font-sans text-xs text-white/25 tracking-wide">
          🔒 Your words stay private. Nothing is saved.
        </span>
      </div>
    </div>
  );
};