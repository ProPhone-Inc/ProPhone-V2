import { useCallback } from 'react';

export function useMagicSparkles(buttonWrapperRef: React.RefObject<HTMLDivElement>) {
  const createSparkles = useCallback((e: React.MouseEvent) => {
    if (!buttonWrapperRef.current) return;
    
    const wrapper = buttonWrapperRef.current;
    const rect = wrapper.getBoundingClientRect();
    const sparkCount = 8;

    wrapper.classList.add('animate');
    setTimeout(() => wrapper.classList.remove('animate'), 700);

    for (let i = 0; i < sparkCount; i++) {
      const spark = document.createElement('div');
      spark.className = 'magic-spark';
      
      const angle = (i / sparkCount) * 360;
      const radius = 20;
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      spark.style.left = `${x}px`;
      spark.style.top = `${y}px`;
      spark.style.transform = `rotate(${angle}deg)`;
      spark.style.animation = `spark 600ms ease-out forwards`;

      wrapper.appendChild(spark);
      setTimeout(() => spark.remove(), 600);
    }
  }, [buttonWrapperRef]);

  return { createSparkles };
}