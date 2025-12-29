import React, { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { RitualStage } from './types';
import { FogBackground } from './components/FogBackground';
import { FireSystem, FireSystemRef } from './components/FireSystem';
import { RitualPaper } from './components/RitualPaper';
import { BreathingGuide } from './components/BreathingGuide';
import { SunriseReveal } from './components/SunriseReveal';

const App: React.FC = () => {
  const [stage, setStage] = useState<RitualStage>(RitualStage.WRITING);
  const fireRef = useRef<FireSystemRef>(null);
  
  // Controls fire intensity based on state
  const [fireIntensity, setFireIntensity] = useState(0.8); 

  // Escape key to restart
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && stage !== RitualStage.WRITING) {
        setStage(RitualStage.WRITING);
        setFireIntensity(0.8);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [stage]);

  const handleDragProgress = (ratio: number) => {
    // Fire flares up as paper approaches
    if (stage === RitualStage.WRITING) {
      setFireIntensity(0.8 + (ratio * 0.4));
    }
  };

  const handleBurn = () => {
    // 1. Ignite visually
    const width = window.innerWidth;
    const height = window.innerHeight;
    fireRef.current?.ignitePaper(width / 2, height - 100);

    // 2. Transition State
    setStage(RitualStage.BURNING);

    // 3. Delay transition to breathing
    setTimeout(() => {
        setStage(RitualStage.BREATHING);
        setFireIntensity(0.2); // Calm the fire down
    }, 2500);
  };

  const handleBreathingComplete = () => {
    setStage(RitualStage.REVEAL);
  };

  return (
    <div className="relative w-full h-screen bg-void overflow-hidden selection:bg-flame selection:text-white">
      {/* Layer 0: Atmosphere */}
      <FogBackground />

      {/* Layer 1: Fire System (Canvas) */}
      <FireSystem ref={fireRef} intensity={stage === RitualStage.REVEAL ? 0 : fireIntensity} />

      {/* Layer 2: Main Interactions */}
      <AnimatePresence mode="wait">
        
        {/* Stage 1 & 2: Writing & Burning */}
        {(stage === RitualStage.WRITING || stage === RitualStage.BURNING) && (
          <motion.div
            key="writing-phase"
            exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
          >
             {/* Only show paper if not burned yet (Visual disappear handled by particle explosion) */}
             {stage === RitualStage.WRITING && (
                <RitualPaper onBurn={handleBurn} onDragProgress={handleDragProgress} />
             )}
          </motion.div>
        )}

        {/* Stage 3: Breathing */}
        {stage === RitualStage.BREATHING && (
           <motion.div
             key="breathing-phase"
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             transition={{ duration: 2 }}
             className="absolute inset-0"
           >
              <BreathingGuide onComplete={handleBreathingComplete} />
           </motion.div>
        )}

        {/* Stage 4: Reveal */}
        {stage === RitualStage.REVEAL && (
            <SunriseReveal key="reveal-phase" onRestart={() => {
              setStage(RitualStage.WRITING);
              setFireIntensity(0.8);
            }} />
        )}

      </AnimatePresence>

      {/* Bottom Light Glow Source (CSS overlay for the fire pit glow on UI elements) */}
      {stage !== RitualStage.REVEAL && (
          <div 
            className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-flame/20 to-transparent pointer-events-none transition-opacity duration-1000"
            style={{ opacity: fireIntensity * 0.5 }}
          />
      )}
    </div>
  );
};

export default App;