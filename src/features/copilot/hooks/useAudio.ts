import { useEffect, useRef } from 'react';

export function useAudio() {
  const notificationSound = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize audio
    if (!notificationSound.current) {
      const audio = new Audio('https://dallasreynoldstn.com/wp-content/uploads/2025/03/CoPilot.wav');
      audio.preload = 'auto';
      audio.volume = 0.3;
      notificationSound.current = audio;
    }
  }, []);

  const playNotification = () => {
    notificationSound.current?.play()
      .catch(() => console.log('Audio playback was prevented'));
  };

  return { playNotification };
}