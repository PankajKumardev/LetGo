
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
        className={`pointer-events-auto relative w-[90vw] max-w-[20rem] sm:max-w-sm md:max-w-md aspect-[3/4] bg-[#e8e6e1] shadow-2xl cursor-grab touch-none ${isDragging ? 'cursor-grabbing' : ''}`}
        style={{
          borderRadius: '2px',
        }}
      >
        {/* Paper Texture Overlay */}
        <div className="absolute inset-0 opacity-40 mix-blend-multiply pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cardboard-flat.png')]" />
        
        {/* Paper Crinkle Effect - intensifies when dragging */}
        <div 
          className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            opacity: isDragging ? 0.08 + charLevel * 0.1 : 0.03,
            mixBlendMode: 'multiply',
          }}
        />
        
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
        
        {/* Paper Tear Effect - jagged bottom edge as it approaches fire */}
        {charLevel > 0.3 && (
          <div 
            className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none z-30 overflow-hidden"
            style={{
              background: `linear-gradient(to top, transparent 0%, rgba(232,230,225,${1 - charLevel}) 100%)`,
              maskImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0,20 L5,${10 + Math.random()*10} L10,${15 + Math.random()*5} L15,${8 + Math.random()*12} L20,${12 + Math.random()*8} L25,${5 + Math.random()*15} L30,${14 + Math.random()*6} L35,${9 + Math.random()*11} L40,${16 + Math.random()*4} L45,${7 + Math.random()*13} L50,${11 + Math.random()*9} L55,${6 + Math.random()*14} L60,${13 + Math.random()*7} L65,${10 + Math.random()*10} L70,${15 + Math.random()*5} L75,${8 + Math.random()*12} L80,${12 + Math.random()*8} L85,${5 + Math.random()*15} L90,${14 + Math.random()*6} L95,${9 + Math.random()*11} L100,${16 + Math.random()*4} L100,20 Z' fill='white'/%3E%3C/svg%3E")`,
              WebkitMaskImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0,20 L5,12 L10,18 L15,8 L20,15 L25,5 L30,16 L35,9 L40,19 L45,7 L50,14 L55,6 L60,17 L65,10 L70,18 L75,8 L80,15 L85,5 L90,16 L95,9 L100,19 L100,20 Z' fill='white'/%3E%3C/svg%3E")`,
              maskSize: '100% 100%',
              WebkitMaskSize: '100% 100%',
              opacity: charLevel * 1.5,
            }}
          />
        )}

        {/* Content Container */}
        <div className="relative z-10 h-full flex flex-col items-center px-4 sm:px-8 pt-8 sm:pt-12 pb-4 sm:pb-6">
            
            {/* Header / Prompt */}
            <h1 className="font-serif italic text-xl sm:text-2xl md:text-3xl text-[#2c2c2c] mb-4 sm:mb-8 mt-2 sm:mt-4 tracking-wide text-center">
              Write it down. Leave it here.
            </h1>

            {/* Writing Area */}
            <div className="flex-grow w-full relative">
               <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type here..."
                className="w-full h-full bg-transparent resize-none border-none outline-none font-hand text-xl sm:text-2xl md:text-3xl text-gray-800 leading-relaxed sm:leading-loose placeholder:text-gray-300 placeholder:font-hand text-center selection:bg-gray-300/50 touch-auto"
                spellCheck={false}
              />
            </div>
            
            {/* Footer */}
            <div className="w-full mt-auto pt-6 flex flex-col items-center gap-3">
                {/* Divider Line */}
                <div className="w-full h-px bg-[#a09e98]" />
                
                {/* Instruction */}
                <span className="font-serif text-xs sm:text-sm tracking-[0.15em] sm:tracking-[0.2em] text-[#888] uppercase opacity-70">
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