import { createContext, useContext, useState, ReactNode } from "react";

interface NotificationData {
  name: string;
  message: string;
  avatar?: string;
}

interface NotificationContextType {
  showNotification: (data: NotificationData) => void;
  notification: NotificationData | null;
  isVisible: boolean;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const playNotificationSound = () => {
  const isMuted = localStorage.getItem("messageSoundMuted") === "true";
  if (!isMuted) {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  }
};

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notification, setNotification] = useState<NotificationData | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const showNotification = (data: NotificationData) => {
    setNotification(data);
    setIsVisible(true);
    playNotificationSound();

    // Hide after 4 seconds
    setTimeout(() => {
      setIsVisible(false);
      // Clear notification data after animation
      setTimeout(() => setNotification(null), 300);
    }, 4000);
  };

  return (
    <NotificationContext.Provider value={{ showNotification, notification, isVisible }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
};
