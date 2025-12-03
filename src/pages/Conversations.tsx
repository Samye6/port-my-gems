import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Search, MoreVertical, Pin, Archive, Trash2, Plus, Bell, BellOff, MessageCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ProfileImageModal from "@/components/ProfileImageModal";
import avatar1 from "@/assets/avatars/avatar-1.jpg";
import { useUnread } from "@/contexts/UnreadContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSoundSettings } from "@/hooks/useSoundSettings";
import { useConversations } from "@/hooks/useConversations";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface Conversation {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  timestamp?: string;
  unread?: number;
  isPinned?: boolean;
  isRead?: boolean;
  isArchived?: boolean;
  avatarUrl?: string;
}

const Conversations = () => {
  const navigate = useNavigate();
  const { id: activeConversationId } = useParams();
  const { setUnreadCount } = useUnread();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [showArchived, setShowArchived] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<{ imageUrl?: string; name: string } | null>(null);
  const { isMuted, toggleMute } = useSoundSettings();
  const { conversations: dbConversations, updateConversation, deleteConversation: deleteConv, loading } = useConversations();
  
  const demoConversation: Conversation = {
    id: "demo-tamara",
    name: "Tamara",
    lastMessage: "Bonjour.. ou salut je sais pas haha... Je viens d'emménager dans le quartier. Je connais pas grand monde en ville mais j'ai eu ton numéro par une amie. Ça te dérange pas si on continue à parler un peu :) ?",
    time: "Maintenant",
    unread: 1,
    isPinned: false,
    isRead: false,
    avatarUrl: avatar1,
  };

  // Convertir les conversations de la DB au format local
  const conversations: Conversation[] = isAuthenticated 
    ? dbConversations.map(conv => ({
        id: conv.id,
        name: conv.character_name,
        lastMessage: conv.last_message || "",
        time: conv.last_message_time 
          ? format(new Date(conv.last_message_time), "HH:mm", { locale: fr })
          : "",
        timestamp: conv.last_message_time || undefined,
        unread: conv.unread_count,
        isPinned: conv.is_pinned,
        isRead: conv.unread_count === 0,
        isArchived: conv.is_archived,
        avatarUrl: conv.character_avatar || undefined,
      }))
    : [demoConversation];

  // Calculate and update unread count whenever conversations change
  useEffect(() => {
    const totalUnread = conversations.reduce((sum, conv) => {
      return sum + (conv.unread ?? 0);
    }, 0);
    setUnreadCount(totalUnread);
  }, [conversations, setUnreadCount]);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setIsAuthenticated(!!session);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const togglePin = async (id: string) => {
    const conversation = conversations.find((c) => c.id === id);
    if (conversation && id !== "demo-tamara") {
      await updateConversation(id, { is_pinned: !conversation.isPinned });
    }
  };

  const toggleArchive = async (id: string) => {
    const conversation = conversations.find((c) => c.id === id);
    if (conversation && id !== "demo-tamara") {
      await updateConversation(id, { is_archived: !conversation.isArchived });
    }
    setShowArchived(false);
  };

  const deleteConversation = async (id: string) => {
    if (id !== "demo-tamara") {
      await deleteConv(id);
    }
  };

  const filteredConversations = conversations.filter((conv) => {
    const matchesSearch = conv.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    
    // Si on affiche les archivées, montrer seulement les archivées
    if (showArchived) {
      return matchesSearch && conv.isArchived;
    }
    
    // Sinon, ne montrer que les non-archivées
    if (activeTab === "unread") {
      return matchesSearch && !conv.isRead && !conv.isArchived;
    }
    return matchesSearch && !conv.isArchived;
  });

  const pinnedConversations = filteredConversations
    .filter((conv) => conv.isPinned)
    .sort((a, b) => {
      if (!a.timestamp) return 1;
      if (!b.timestamp) return -1;
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });

  const unpinnedConversations = filteredConversations
    .filter((conv) => !conv.isPinned)
    .sort((a, b) => {
      if (!a.timestamp) return 1;
      if (!b.timestamp) return -1;
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });

  const sortedConversations = [...pinnedConversations, ...unpinnedConversations];

  const archivedCount = conversations.filter((conv) => conv.isArchived).length;

  return (
    <div className="h-full flex flex-col overflow-hidden relative">
      {/* Premium gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-violet/5 via-background to-background pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-br from-violet/3 via-transparent to-peach/3 pointer-events-none" />
      
      {/* Header avec glow */}
      <div className="relative border-b border-border/50 glass sticky top-0 z-10">
        <div className="absolute inset-0 bg-gradient-to-r from-violet/5 via-primary/5 to-peach/5 pointer-events-none" />
        <div className="px-3 py-2 flex items-center justify-between relative">
          <div className="relative">
            <h1 className="text-xl font-semibold text-foreground">Mes conversations</h1>
            {/* Glow derrière le titre */}
            <div className="absolute -inset-2 bg-gradient-to-r from-violet/20 via-primary/10 to-transparent blur-xl -z-10" />
          </div>
          <button
            onClick={toggleMute}
            className="p-2 rounded-full glass hover:bg-primary/10 transition-all duration-300 hover:shadow-[0_0_15px_hsl(var(--primary)/0.3)]"
          >
            {isMuted ? (
              <BellOff className="w-5 h-5 text-muted-foreground" />
            ) : (
              <Bell className="w-5 h-5 text-primary" />
            )}
          </button>
        </div>
      </div>

      {/* Search Bar - Glassmorphism Premium */}
      <div className="px-4 py-3 relative">
        <div className="relative group">
          {/* Glow au focus */}
          <div className="absolute -inset-1 bg-gradient-to-r from-violet/20 via-primary/20 to-peach/20 rounded-2xl blur-lg opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
          <div className="relative glass rounded-xl overflow-hidden border border-border/30 group-focus-within:border-primary/30 transition-colors">
            <div className="absolute inset-0 bg-gradient-to-r from-violet/5 via-transparent to-peach/5 pointer-events-none" />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/70 group-focus-within:text-primary transition-colors" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher une conversation..."
              className="pl-10 bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
        </div>
      </div>

      {/* Tabs - Glassmorphism Premium */}
      <div className="px-4 py-2 relative">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-transparent gap-2 p-0 h-auto">
            <TabsTrigger
              value="all"
              className="relative overflow-hidden data-[state=active]:text-primary-foreground rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-300
                data-[state=inactive]:glass data-[state=inactive]:border data-[state=inactive]:border-border/30 data-[state=inactive]:hover:border-primary/30 data-[state=inactive]:hover:bg-primary/5
                data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet data-[state=active]:via-primary data-[state=active]:to-peach data-[state=active]:shadow-[0_0_20px_hsl(var(--primary)/0.4)]"
            >
              Toutes
            </TabsTrigger>
            <TabsTrigger
              value="unread"
              className="relative overflow-hidden data-[state=active]:text-primary-foreground rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-300
                data-[state=inactive]:glass data-[state=inactive]:border data-[state=inactive]:border-border/30 data-[state=inactive]:hover:border-primary/30 data-[state=inactive]:hover:bg-primary/5
                data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet data-[state=active]:via-primary data-[state=active]:to-peach data-[state=active]:shadow-[0_0_20px_hsl(var(--primary)/0.4)]"
            >
              Non lues
            </TabsTrigger>
          </TabsList>

          <button
            onClick={() => setShowArchived(!showArchived)}
            className="flex items-center gap-2 mt-3 mb-2 ml-1 group transition-all duration-300"
          >
            <Archive className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
              Archivées {archivedCount > 0 && `(${archivedCount})`}
            </span>
          </button>

          <TabsContent value="all" className="mt-0">
            {showArchived && (
              <div className="mb-3 px-1">
                <p className="text-sm text-muted-foreground">
                  Conversations archivées
                </p>
              </div>
            )}
            <ConversationList
              conversations={sortedConversations}
              navigate={navigate}
              onTogglePin={togglePin}
              onArchive={toggleArchive}
              onUnarchive={toggleArchive}
              onDelete={deleteConversation}
              showArchived={showArchived}
              isAuthenticated={isAuthenticated}
              activeConversationId={activeConversationId}
              onOpenProfile={(imageUrl, name) => {
                setSelectedProfile({ imageUrl, name });
                setShowProfileModal(true);
              }}
            />
          </TabsContent>

          <TabsContent value="unread" className="mt-0">
            {showArchived && (
              <div className="mb-3 px-1">
                <p className="text-sm text-muted-foreground">
                  Conversations archivées
                </p>
              </div>
            )}
            <ConversationList
              conversations={sortedConversations}
              navigate={navigate}
              onTogglePin={togglePin}
              onArchive={toggleArchive}
              onUnarchive={toggleArchive}
              onDelete={deleteConversation}
              showArchived={showArchived}
              isAuthenticated={isAuthenticated}
              activeConversationId={activeConversationId}
              onOpenProfile={(imageUrl, name) => {
                setSelectedProfile({ imageUrl, name });
                setShowProfileModal(true);
              }}
            />
          </TabsContent>
        </Tabs>
      </div>

      <ProfileImageModal
        isOpen={showProfileModal}
        onClose={() => {
          setShowProfileModal(false);
          setSelectedProfile(null);
        }}
        imageUrl={selectedProfile?.imageUrl}
        name={selectedProfile?.name || ""}
      />
    </div>
  );
};

interface ConversationListProps {
  conversations: Conversation[];
  navigate: ReturnType<typeof useNavigate>;
  onTogglePin: (id: string) => void;
  onArchive: (id: string) => void;
  onUnarchive: (id: string) => void;
  onDelete: (id: string) => void;
  showArchived: boolean;
  isAuthenticated: boolean;
  activeConversationId?: string;
  onOpenProfile: (imageUrl: string | undefined, name: string) => void;
}

const ConversationList = ({
  conversations,
  navigate,
  onTogglePin,
  onArchive,
  onUnarchive,
  onDelete,
  showArchived,
  isAuthenticated,
  activeConversationId,
  onOpenProfile,
}: ConversationListProps) => {
  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <p className="text-muted-foreground">Aucune conversation</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {conversations.map((conv, index) => {
        const isActive = activeConversationId === conv.id;
        return (
        <div
          key={conv.id}
          className={`group relative rounded-2xl transition-all duration-300 animate-fade-in-up ${
            isActive 
              ? 'glass border border-primary/30 shadow-[0_0_25px_hsl(var(--primary)/0.2)]' 
              : 'glass border border-border/20 hover:border-primary/20 hover:shadow-[0_0_20px_hsl(var(--violet)/0.15)]'
          }`}
          style={{ animationDelay: `${index * 50}ms` }}
        >
          {/* Glow effect on active/hover */}
          <div className={`absolute inset-0 rounded-2xl transition-opacity duration-300 pointer-events-none ${
            isActive 
              ? 'bg-gradient-to-r from-violet/10 via-primary/10 to-peach/10 opacity-100' 
              : 'bg-gradient-to-r from-violet/5 via-primary/5 to-peach/5 opacity-0 group-hover:opacity-100'
          }`} />
          
          <div className="flex items-center gap-3 p-3 relative">
            <button
              onClick={() => navigate(`/conversations/${conv.id}`, { 
                state: { 
                  preferences: { 
                    characterName: conv.name,
                    avatarUrl: conv.avatarUrl
                  } 
                } 
              })}
              className="flex items-center gap-3 flex-1 min-w-0"
            >
              {/* Avatar avec halo premium */}
              <div className="relative">
                <div className={`absolute -inset-1 rounded-full transition-all duration-300 ${
                  isActive 
                    ? 'bg-gradient-to-r from-violet via-primary to-peach opacity-50 blur-md' 
                    : 'bg-gradient-to-r from-violet via-primary to-peach opacity-0 group-hover:opacity-30 blur-md'
                }`} />
                <Avatar 
                  className="w-12 h-12 flex-shrink-0 cursor-pointer hover:scale-105 transition-transform relative ring-2 ring-border/30 group-hover:ring-primary/30" 
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenProfile(conv.avatarUrl, conv.name);
                  }}
                >
                  {conv.avatarUrl && <AvatarImage src={conv.avatarUrl} alt={conv.name} />}
                  <AvatarFallback className="bg-gradient-to-br from-violet/30 via-primary/30 to-peach/30 text-primary text-base font-semibold">
                    {conv.name[0]}
                  </AvatarFallback>
                </Avatar>
              </div>
              
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center justify-between mb-0.5">
                  <h3
                    className={`text-foreground transition-colors ${
                      !conv.isRead ? "font-bold" : "font-medium"
                    }`}
                  >
                    {conv.name}
                  </h3>
                  <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">
                    {conv.time}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <p
                    className={`text-sm truncate ${
                      !conv.isRead
                        ? "text-foreground font-medium"
                        : "text-muted-foreground"
                    }`}
                  >
                    {conv.lastMessage}
                  </p>
                  {/* Badge non lu premium */}
                  {(conv.unread ?? 0) > 0 && (
                    <span className="relative flex-shrink-0">
                      <span className="absolute inset-0 bg-gradient-to-r from-primary to-peach rounded-full blur-sm opacity-60" />
                      <span className="relative bg-gradient-to-r from-primary to-peach text-primary-foreground text-xs font-semibold px-2 py-0.5 rounded-full min-w-[20px] text-center">
                        {conv.unread}
                      </span>
                    </span>
                  )}
                </div>
              </div>
            </button>

            <div className="flex items-center gap-1 flex-shrink-0">
              {conv.isPinned && (
                <Pin className="w-4 h-4 text-primary/70" />
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-1.5 glass rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-primary/10 hover:shadow-[0_0_10px_hsl(var(--primary)/0.2)]">
                    <MoreVertical className="w-4 h-4 text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 glass border-border/50">
                  {!showArchived && (
                    <DropdownMenuItem
                      onClick={() => onTogglePin(conv.id)}
                      className="gap-2 focus:bg-primary/10"
                    >
                      <Pin className="w-4 h-4" />
                      {conv.isPinned ? "Désépingler" : "Épingler"}
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    onClick={() => showArchived ? onUnarchive(conv.id) : onArchive(conv.id)}
                    className="gap-2 focus:bg-primary/10"
                  >
                    <Archive className="w-4 h-4" />
                    {showArchived ? "Désarchiver" : "Archiver"}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onDelete(conv.id)}
                    className="gap-2 text-destructive focus:text-destructive focus:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4" />
                    Supprimer
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
        );
      })}
      
      {/* Bouton Nouvelle conversation - Ultra Premium */}
      <div className="flex justify-center py-6 animate-fade-in-up">
        <div className="relative group w-full max-w-xs">
          {/* Glow externe */}
          <div className="absolute -inset-1 bg-gradient-to-r from-violet via-primary to-peach rounded-full blur-lg opacity-50 group-hover:opacity-80 transition-opacity duration-500" />
          
          <Button
            onClick={() => navigate(isAuthenticated ? "/scenarios" : "/auth")}
            size="lg"
            className="relative w-full bg-gradient-to-r from-violet via-primary to-peach hover:from-violet/90 hover:via-primary/90 hover:to-peach/90 text-primary-foreground font-semibold rounded-full shadow-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_40px_hsl(var(--primary)/0.5)] active:scale-[0.98] overflow-hidden"
          >
            {/* Shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            <MessageCircle className="w-5 h-5 mr-2" />
            Nouvelle conversation
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Conversations;
