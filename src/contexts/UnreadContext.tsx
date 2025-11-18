import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

interface UnreadContextType {
  unreadCount: number;
  setUnreadCount: (count: number) => void;
}

const UnreadContext = createContext<UnreadContextType | undefined>(undefined);

export const UnreadProvider = ({ children }: { children: ReactNode }) => {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Load initial count from localStorage
    const storedCount = localStorage.getItem("unreadCount");
    if (storedCount) {
      setUnreadCount(parseInt(storedCount, 10));
    }

    // Reset count when user logs out
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!session && event === "SIGNED_OUT") {
          setUnreadCount(1); // Demo conversation with Tamara has 1 unread
          localStorage.setItem("unreadCount", "1");
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const updateUnreadCount = (count: number) => {
    setUnreadCount(count);
    localStorage.setItem("unreadCount", count.toString());
  };

  return (
    <UnreadContext.Provider value={{ unreadCount, setUnreadCount: updateUnreadCount }}>
      {children}
    </UnreadContext.Provider>
  );
};

export const useUnread = () => {
  const context = useContext(UnreadContext);
  if (context === undefined) {
    throw new Error("useUnread must be used within an UnreadProvider");
  }
  return context;
};
