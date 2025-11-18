import { useState, useEffect } from "react";

export const useSoundSettings = () => {
  const [isMuted, setIsMuted] = useState(() => {
    const saved = localStorage.getItem("messageSoundMuted");
    return saved === "true";
  });

  const toggleMute = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    localStorage.setItem("messageSoundMuted", String(newMutedState));
  };

  const playMessageSound = () => {
    if (!isMuted) {
      // Créer un son de notification simple avec Web Audio API
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Configuration du son (deux notes rapides)
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.1);
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    }
  };

  return { isMuted, toggleMute, playMessageSound };
};
