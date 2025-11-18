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

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notification, setNotification] = useState<NotificationData | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const showNotification = (data: NotificationData) => {
    setNotification(data);
    setIsVisible(true);

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
