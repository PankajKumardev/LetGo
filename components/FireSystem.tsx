import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { Particle } from '../types';

interface FireSystemProps {
  intensity: number; // 0 to 1
}

export interface FireSystemRef {
  ignitePaper: (x: number, y: number) => void;
}

export const FireSystem = forwardRef<FireSystemRef, FireSystemProps>(({ intensity }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);

  useImperativeHandle(ref, () => ({
    ignitePaper: (x, y) => {
      // Spawn a massive burst of sparks/embers at the drop location
      for (let i = 0; i < 150; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 5 + 2;
        particles.current.push({
          x: x,
          y: y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 5, // Upward bias
          life: Math.random() * 100 + 50,
          maxLife: 150,
          size: Math.random() * 3 + 1,
          color: '#FFD700', // Gold
          type: 'ember'
        });
      }
    }
  }));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    // Center bottom fire origin
    const originX = width / 2;
    const originY = height;

    let animationId: number;

    const spawnFireParticle = () => {
        // Only spawn base fire if intensity > 0
        if (intensity <= 0.05) return;

        const count = Math.floor(intensity * 5); 
        for(let i=0; i<count; i++) {
            const angle = (Math.random() - 0.5) * 0.5 - Math.PI / 2; // Upwards cone
            const speed = Math.random() * 3 + 2;
            particles.current.push({
                x: originX + (Math.random() - 0.5) * 100, // Width of fire pit
                y: originY + 20,
                vx: Math.cos(angle) * speed * 0.5,
                vy: Math.sin(angle) * speed - 2,
                life: Math.random() * 60 + 20,
                maxLife: 80,
                size: Math.random() * 15 + 5,
                color: `hsl(${Math.random() * 40 + 10}, 100%, 50%)`, // Orange/Yellow/Red
                type: 'fire'
            });
        }
        
        // Spawn smoke particles (less frequently)
        if (Math.random() < 0.3 * intensity) {
            particles.current.push({
                x: originX + (Math.random() - 0.5) * 80,
                y: originY - 50,
                vx: (Math.random() - 0.5) * 0.5,
                vy: -Math.random() * 1.5 - 0.5,
                life: Math.random() * 120 + 60,
                maxLife: 180,
                size: Math.random() * 30 + 20,
                color: 'rgba(80, 80, 80, 0.3)',
                type: 'spark' // Using spark type for smoke
            });
        }
    };

    const updateAndDraw = () => {
      ctx.clearRect(0, 0, width, height);

      spawnFireParticle();

      for (let i = particles.current.length - 1; i >= 0; i--) {
        const p = particles.current[i];
        
        p.life--;
        p.x += p.vx;
        p.y += p.vy;

        // Gravity/Wind based on particle type
        if (p.type === 'ember') {
            p.vy += 0.05; // Light gravity
            p.vx += (Math.random() - 0.5) * 0.1; // Jitter
        } else if (p.type === 'spark') {
            // Smoke behavior - rises and expands
            p.size *= 1.01; // Smoke expands
            p.vx += (Math.random() - 0.5) * 0.1; // Drift
        } else {
            p.size *= 0.96; // Fire shrinks
            // Fire turbulence
            p.x += Math.sin(p.life * 0.1) * 0.5;
        }

        if (p.life <= 0 || (p.type !== 'spark' && p.size <= 0.1)) {
          particles.current.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        const alpha = p.life / p.maxLife;
        
        if (p.type === 'ember') {
            ctx.globalCompositeOperation = 'lighter';
            ctx.fillStyle = `rgba(255, 215, 0, ${alpha})`;
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        } else if (p.type === 'spark') {
            // Smoke rendering
            ctx.globalCompositeOperation = 'source-over';
            ctx.fillStyle = `rgba(60, 60, 70, ${alpha * 0.15})`;
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        } else {
            // Fire gradient logic
            ctx.globalCompositeOperation = 'lighter';
            const hue = 10 + (30 * (p.life / p.maxLife)); // Red fades to yellow
            ctx.fillStyle = `hsla(${hue}, 100%, 50%, ${alpha})`;
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        }
        
        ctx.fill();
      }

      ctx.globalCompositeOperation = 'source-over';
      animationId = requestAnimationFrame(updateAndDraw);
    };

    updateAndDraw();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, [intensity]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-10 pointer-events-none"
    />
  );
});

FireSystem.displayName = 'FireSystem';