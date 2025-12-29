import React, { useEffect, useRef } from 'react';

export const FogBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const fogParticles: { x: number; y: number; r: number; dx: number; dy: number; a: number }[] = [];
    const particleCount = 40;

    for (let i = 0; i < particleCount; i++) {
      fogParticles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 200 + 100,
        dx: (Math.random() - 0.5) * 0.2,
        dy: (Math.random() - 0.5) * 0.2,
        a: Math.random() * 0.05,
      });
    }

    let animationId: number;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Base void color
      ctx.fillStyle = '#030303';
      ctx.fillRect(0, 0, width, height);

      // Draw subtle fog
      fogParticles.forEach((p) => {
        p.x += p.dx;
        p.y += p.dy;

        if (p.x < -p.r) p.x = width + p.r;
        if (p.x > width + p.r) p.x = -p.r;
        if (p.y < -p.r) p.y = height + p.r;
        if (p.y > height + p.r) p.y = -p.r;

        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
        gradient.addColorStop(0, `rgba(40, 40, 50, ${p.a})`);
        gradient.addColorStop(1, 'rgba(3, 3, 3, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // Scanline/Grain overlay simulated with very distinct faint lines
      ctx.fillStyle = 'rgba(255, 255, 255, 0.015)';
      for(let i = 0; i < height; i+=4) {
          ctx.fillRect(0, i, width, 1);
      }

      animationId = requestAnimationFrame(render);
    };

    render();

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
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 z-0 pointer-events-none"
    />
  );
};