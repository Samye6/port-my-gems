import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Conversations from "./Conversations";
import ChatConversation from "./ChatConversation";
import BottomNav from "@/components/BottomNav";
import { useIsMobile } from "@/hooks/use-mobile";
import { useConversations } from "@/hooks/useConversations";
import { supabase } from "@/integrations/supabase/client";
import lydiaLogo from "@/assets/lydia-logo.png";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

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
              
              {/* Glow effect */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse" />
              </div>

              <div className="text-center space-y-6 max-w-sm px-6 relative z-10">
                {/* Logo with pulse glow */}
                <div className="relative w-24 h-24 mx-auto">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/40 via-violet/30 to-peach/30 rounded-full blur-2xl animate-pulse" />
                  <div className="relative w-full h-full rounded-full glass border border-primary/20 flex items-center justify-center shadow-[0_0_30px_hsl(var(--primary)/0.3)]">
                    <img src={lydiaLogo} alt="Lydia" className="w-14 h-14 object-contain" style={{ filter: 'drop-shadow(0 0 15px hsl(var(--primary) / 0.5))' }} />
                  </div>
                </div>

                {/* Text */}
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold text-foreground">
                    Aucune conversation pour le moment.
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    Choisis une personnalité et commence une discussion immersive.
                  </p>
                </div>

                {/* CTA Buttons */}
                <div className="space-y-3 pt-2">
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-violet via-primary to-peach rounded-full blur-lg opacity-50 group-hover:opacity-80 transition-opacity duration-500" />
                    <Button
                      onClick={() => navigate("/")}
                      size="lg"
                      className="relative w-full bg-gradient-to-r from-violet via-primary to-peach hover:from-violet/90 hover:via-primary/90 hover:to-peach/90 text-primary-foreground font-semibold rounded-full shadow-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_40px_hsl(var(--primary)/0.5)] active:scale-[0.98] overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                      <MessageCircle className="w-5 h-5 mr-2" />
                      Explorer les personnalités
                    </Button>
                  </div>

                  <button
                    onClick={() => navigate("/")}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Retour à l'accueil
                  </button>
                </div>

                {/* Micro-copy */}
                <p className="text-xs text-muted-foreground/60">
                  5 personnalités disponibles maintenant.
                </p>
                <p className="text-xs text-muted-foreground/40 italic">
                  Chaque relation commence par un premier message.
                </p>
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
