import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Conversations from "./Conversations";
import ChatConversation from "./ChatConversation";
import BottomNav from "@/components/BottomNav";
import { useIsMobile } from "@/hooks/use-mobile";
import { useConversations } from "@/hooks/useConversations";
import { supabase } from "@/integrations/supabase/client";
import lydiaLogo from "@/assets/lydia-logo.png";
import SuggestedCharacters from "@/components/home/SuggestedCharacters";

const MessagesLayout = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { conversations, loading } = useConversations();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasAutoOpened, setHasAutoOpened] = useState(false);

  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };
    checkAuth();
  }, []);

  // Auto-open last conversation on desktop when no conversation is selected
  useEffect(() => {
    if (!isMobile && !id && !loading && conversations.length > 0 && !hasAutoOpened && isAuthenticated) {
      // Find the most recent non-archived conversation
      const lastConversation = conversations.find(c => !c.is_archived);
      if (lastConversation) {
        setHasAutoOpened(true);
        navigate(`/conversations/${lastConversation.id}`, { replace: true });
      }
    }
  }, [isMobile, id, loading, conversations, hasAutoOpened, isAuthenticated, navigate]);

  // Sur mobile, si aucune conversation n'est sélectionnée, afficher seulement la liste
  if (isMobile && !id) {
    return (
      <>
        <Conversations />
        <BottomNav />
      </>
    );
  }

  // Sur mobile, si une conversation est sélectionnée, afficher seulement le chat
  if (isMobile && id) {
    return (
      <>
        <ChatConversation />
        <BottomNav />
      </>
    );
  }

  // Sur desktop, afficher les deux côte à côte
  return (
    <>
      <div className="flex h-screen w-full overflow-hidden pb-20">
        {/* Liste des conversations - côté gauche */}
        <div className="w-[400px] border-r border-border flex-shrink-0 overflow-hidden">
          <Conversations />
        </div>

        {/* Zone de chat - côté droit */}
        <div className="flex-1 flex flex-col">
          {id ? (
            <ChatConversation />
          ) : (
            <div className="h-full flex items-center justify-center bg-background relative overflow-hidden">
              {/* Premium gradient background */}
              <div className="absolute inset-0 bg-gradient-to-b from-violet/5 via-background to-background pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-br from-violet/3 via-transparent to-peach/3 pointer-events-none" />
              
              {/* Animated gradient effect */}
              <div className="absolute inset-0 opacity-30">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-peach/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
              </div>

              <div className="text-center space-y-8 max-w-2xl px-6 relative z-10">
                {/* Logo with premium glow */}
                <div className="w-32 h-32 mx-auto flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-violet/30 via-primary/30 to-peach/30 rounded-full blur-2xl animate-pulse" />
                  <img 
                    src={lydiaLogo} 
                    alt="Lydia Logo" 
                    className="w-full h-full object-contain relative z-10"
                    style={{ filter: 'drop-shadow(0 0 30px hsl(var(--primary) / 0.5))' }}
                  />
                </div>

                {/* Suggested Characters Section */}
                <SuggestedCharacters />
              </div>
            </div>
          )}
        </div>
      </div>
      <BottomNav />
    </>
  );
};

export default MessagesLayout;
