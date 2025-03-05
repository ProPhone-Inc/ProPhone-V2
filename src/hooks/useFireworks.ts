import { useCallback } from 'react';

export function useFireworks(containerRef: React.RefObject<HTMLDivElement>) {
  const createFirework = useCallback((x: number, y: number) => {
    if (!containerRef.current) return;
    
    const createTrail = () => {
      const trail = document.createElement('div');
      trail.className = 'firework';
      trail.style.left = `${x}px`;
      trail.style.top = `${y + Math.random() * 10}px`;
      trail.style.transform = 'scale(0.3)';
      container.appendChild(trail);
      setTimeout(() => trail.remove(), 300);
    };

    for (let i = 0; i < 3; i++) {
      setTimeout(createTrail, i * 50);
    }

    const container = containerRef.current;
    const firework = document.createElement('div');
    firework.className = 'firework';
    firework.style.left = `${x}px`;
    firework.style.top = `${y}px`;
    container.appendChild(firework);

    setTimeout(() => {
      const particleCount = 40;
      const colors = ['#FFD700', '#FFA500', '#FFFFFF', '#B38B3F', '#FFC125'];
      
      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'firework-particle';
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        
        const angle = (i / particleCount) * 360 + Math.random() * 30;
        const velocity = 100 + Math.random() * 100;
        const tx = Math.cos(angle * Math.PI / 180) * velocity;
        const ty = Math.sin(angle * Math.PI / 180) * velocity;
        
        particle.style.setProperty('--tx', `${tx}px`);
        particle.style.setProperty('--ty', `${ty}px`);
        
        container.appendChild(particle);
        setTimeout(() => particle.remove(), 1200);
      }
    }, 200);

    setTimeout(() => firework.remove(), 1200);
  }, [containerRef]);

  const launchFireworks = useCallback(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    
    for (let i = 0; i < 7; i++) {
      setTimeout(() => {
        const x = Math.random() * rect.width;
        const y = rect.height;
        createFirework(x, y);
      }, i * 150);
    }
  }, [containerRef, createFirework]);

  return { launchFireworks };
}