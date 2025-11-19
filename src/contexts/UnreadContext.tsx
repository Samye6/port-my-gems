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
    // Fonction pour calculer le total des messages non lus
    const fetchUnreadCount = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // Utilisateur non connecté : 1 message de Tamara
        setUnreadCount(1);
        localStorage.setItem("unreadCount", "1");
        return;
      }

      // Utilisateur connecté : récupérer le total depuis la DB
      try {
        const { data, error } = await supabase
          .from('conversations')
          .select('unread_count');

        if (error) throw error;

        const total = data?.reduce((sum, conv) => sum + (conv.unread_count || 0), 0) || 0;
        setUnreadCount(total);
        localStorage.setItem("unreadCount", total.toString());
      } catch (error) {
        console.error('Error fetching unread count:', error);
      }
    };

    // Charger le compteur initial
    fetchUnreadCount();

    // Écouter les changements d'authentification
    const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!session && event === "SIGNED_OUT") {
          setUnreadCount(1); // Demo conversation avec Tamara a 1 non lu
          localStorage.setItem("unreadCount", "1");
        } else if (session) {
          fetchUnreadCount();
        }
      }
    );

    // Écouter les changements en temps réel dans la table conversations
    const conversationsChannel = supabase
      .channel('conversations-unread-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversations'
        },
        () => {
          // Recalculer le total à chaque changement
          fetchUnreadCount();
        }
      )
      .subscribe();

    return () => {
      authSubscription.unsubscribe();
      supabase.removeChannel(conversationsChannel);
    };
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
