import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNotification } from "@/contexts/NotificationContext";
import { useMessages } from "@/hooks/useMessages";
import { useConversations } from "@/hooks/useConversations";
import { useIsMobile } from "@/hooks/use-mobile";
import { ArrowLeft, Send, MoreVertical, Paperclip, Smile, Check, Bell, BellOff, Edit2, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
  read?: boolean;
}

const ChatConversation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const { toast } = useToast();
  const { showNotification } = useNotification();
  const isMobile = useIsMobile();
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const [aiResponseCount, setAiResponseCount] = useState(0);
  const [localMessages, setLocalMessages] = useState<Message[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [persistedConversationId, setPersistedConversationId] = useState<string | null>(null);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  
  // Get conversation ID - use persisted ID if available, otherwise original ID
  const actualConversationId = persistedConversationId || (id !== 'new' && id !== 'demo-tamara' ? id || null : null);
  const { messages: dbMessages, loading, sendMessage } = useMessages(actualConversationId);
  const { createConversation, refetch } = useConversations();

  // Get preferences from location state or use default
  const preferences = location.state?.preferences || {};
  const characterName = preferences.characterName || "Sarah";
  const avatarUrl = preferences.avatarUrl;

  useEffect(() => {
    let hasRun = false;

    const checkAuth = async () => {
      if (hasRun) return;
      hasRun = true;

      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
      
      // Créer automatiquement une conversation persistante pour les utilisateurs authentifiés
      if (session && (id === "demo-tamara" || id === "new") && !persistedConversationId) {
        try {
          const isDemoConversation = id === "demo-tamara";
          const initialText = isDemoConversation
            ? "Bonjour.. ou salut je sais pas haha... Je viens d'emménager dans le quartier. Je connais pas grand monde en ville mais j'ai eu ton numéro par une amie. Ça te dérange pas si on continue à parler un peu :) ?"
            : "Hey... je voulais te parler de quelque chose. Tu as un moment ?";
          
          const conversationData = {
            character_name: isDemoConversation ? "Tamara" : characterName,
            character_avatar: avatarUrl || null,
            scenario_id: null,
            preferences: preferences,
          };
          
          const newConv = await createConversation(conversationData);
          if (newConv) {
            setPersistedConversationId(newConv.id);
            
            // Envoyer le message initial
            setTimeout(async () => {
              try {
                await sendMessage(initialText, "ai");
              } catch (error) {
                console.error("Error sending initial message:", error);
              }
            }, 100);
          }
          
        } catch (error) {
          console.error("Error creating conversation:", error);
        }
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setIsAuthenticated(!!session);
      }
    );

    return () => subscription.unsubscribe();
  }, [id]);

  // Réinitialiser le compteur de messages non lus quand on ouvre la conversation
  useEffect(() => {
    const resetUnreadCount = async () => {
      if (!actualConversationId) return;
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      try {
        await supabase
          .from('conversations')
          .update({ unread_count: 0 })
          .eq('id', actualConversationId);
        
        console.log('Unread count reset for conversation:', actualConversationId);
      } catch (error) {
        console.error("Error resetting unread count:", error);
      }
    };

    resetUnreadCount();
  }, [actualConversationId]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setIsAuthenticated(!!session);
      }
    );

    // Si c'est une conversation demo ou nouvelle ET que l'utilisateur n'est pas authentifié,
    // charger les messages depuis localStorage ou initialiser avec un message de bienvenue
    if (!isAuthenticated && (id === "demo-tamara" || id === "new")) {
      const storageKey = `conversation_${id}`;
      const savedMessages = localStorage.getItem(storageKey);
      
      if (savedMessages) {
        try {
          const parsed = JSON.parse(savedMessages);
          setLocalMessages(parsed.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          })));
        } catch (error) {
          console.error("Error parsing saved messages:", error);
        }
      } else {
        const isDemoConversation = id === "demo-tamara";
        const initialText = isDemoConversation
          ? "Bonjour.. ou salut je sais pas haha... Je viens d'emménager dans le quartier. Je connais pas grand monde en ville mais j'ai eu ton numéro par une amie. Ça te dérange pas si on continue à parler un peu :) ?"
          : "Hey... je voulais te parler de quelque chose. Tu as un moment ?";

        const initialMessage: Message = {
          id: "1",
          text: initialText,
          sender: "ai",
          timestamp: new Date(),
          read: false,
        };
        setLocalMessages([initialMessage]);
      }
    }

    return () => subscription.unsubscribe();
  }, [id]);

  // Convertir les messages de la DB au format local
  const displayMessages = actualConversationId 
    ? dbMessages.map(msg => ({
        id: msg.id,
        text: msg.content,
        sender: msg.sender,
        timestamp: new Date(msg.created_at),
        read: false
      }))
    : localMessages;

  const scrollToBottom = (force = false) => {
    if (force || !isUserScrolling) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      setShowScrollButton(false);
    }
  };

  const handleScroll = () => {
    if (!messagesContainerRef.current) {
      console.log('No messages container ref');
      return;
    }
    
    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
    console.log('Scroll event:', { scrollTop, scrollHeight, clientHeight, distanceFromBottom: scrollHeight - (scrollTop + clientHeight) });
    const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);
    
    // Si l'utilisateur est à plus de 100px du bas, on considère qu'il scrolle
    if (distanceFromBottom > 100) {
      setIsUserScrolling(true);
      setShowScrollButton(true);
    } else {
      setIsUserScrolling(false);
      setShowScrollButton(false);
    }
  };

  const getDateLabel = (date: Date): string => {
    const today = new Date();
    const messageDate = new Date(date);
    
    // Reset hours for comparison
    today.setHours(0, 0, 0, 0);
    messageDate.setHours(0, 0, 0, 0);
    
    const diffTime = today.getTime() - messageDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "AUJOURD'HUI";
    if (diffDays === 1) return "HIER";
    
    return messageDate.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric"
    }).toUpperCase();
  };

  const shouldShowDateSeparator = (currentMsg: Message, prevMsg: Message | undefined): boolean => {
    if (!prevMsg) return true;
    
    const currentDate = new Date(currentMsg.timestamp);
    const prevDate = new Date(prevMsg.timestamp);
    
    currentDate.setHours(0, 0, 0, 0);
    prevDate.setHours(0, 0, 0, 0);
    
    return currentDate.getTime() !== prevDate.getTime();
  };

  const getTamaraResponseDelay = (responseCount: number): number => {
    const delays = [15000, 10000, 20000, 5000, 30000];
    
    if (responseCount < delays.length) {
      return delays[responseCount];
    }
    
    // Aléatoire entre 10s et 1 minute pour les réponses suivantes
    const minDelay = 10000;
    const maxDelay = 60000;
    return Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
  };

  useEffect(() => {
    // Seulement scroller automatiquement si l'utilisateur n'est pas en train de regarder l'historique
    if (!isUserScrolling) {
      scrollToBottom();
    }
  }, [displayMessages, isTyping, isUserScrolling]);

  // Sauvegarder les messages locaux dans localStorage pour les visiteurs
  useEffect(() => {
    if (!isAuthenticated && !actualConversationId && localMessages.length > 0 && id) {
      const storageKey = `conversation_${id}`;
      try {
        localStorage.setItem(storageKey, JSON.stringify(localMessages));
      } catch (error) {
        console.error("Error saving messages to localStorage:", error);
      }
    }
  }, [localMessages, isAuthenticated, actualConversationId, id]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const isDemoConversation = id === "demo-tamara";
    if (!isAuthenticated && isDemoConversation && messageCount >= 10) {
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
      read: false,
    };

    // Sauvegarder dans la DB si c'est une conversation persistante
    if (actualConversationId) {
      try {
        await sendMessage(inputValue, "user");
      } catch (error) {
        console.error("Error sending message:", error);
        toast({
          title: "Erreur",
          description: "Impossible d'envoyer le message",
          variant: "destructive",
        });
        return;
      }
    } else {
      // Sinon stocker localement
      setLocalMessages((prev) => [...prev, userMessage]);
    }

    setInputValue("");
    setMessageCount((prev) => prev + 1);

    const isDemoTamara = id === "demo-tamara";
    const responseDelay = isDemoTamara ? getTamaraResponseDelay(aiResponseCount) : 2000;
    
    // Marquer le message comme lu 10 secondes avant la réponse
    const readDelay = Math.max(0, responseDelay - 10000);
    
    setTimeout(() => {
      if (!actualConversationId) {
        setLocalMessages((prev) =>
          prev.map((msg) =>
            msg.id === userMessage.id ? { ...msg, read: true } : msg
          )
        );
      }
      // Commencer à "écrire" juste après que le message soit lu
      setIsTyping(true);
    }, readDelay);

    setTimeout(async () => {
      try {
        // Préparer l'historique des messages pour l'IA
        const conversationHistory = displayMessages.slice(-10).map(msg => ({
          sender: msg.sender,
          text: msg.text
        }));
        
        // Ajouter le message de l'utilisateur qui vient d'être envoyé
        conversationHistory.push({
          sender: "user",
          text: userMessage.text
        });

        console.log("Calling AI with preferences:", preferences);
        console.log("Conversation history:", conversationHistory);

        // Appeler l'edge function pour générer la réponse
        const { data: aiResponse, error: aiError } = await supabase.functions.invoke('chat-ai-response', {
          body: { 
            messages: conversationHistory,
            preferences: preferences
          }
        });

        if (aiError) {
          console.error("Error calling AI function:", aiError);
          throw aiError;
        }

        const aiText = aiResponse?.text || "Désolé, je ne peux pas répondre pour le moment. Peux-tu réessayer ?";

        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: aiText,
          sender: "ai",
          timestamp: new Date(),
          read: false,
        };

        // Sauvegarder la réponse de l'IA
        if (actualConversationId) {
          try {
            await sendMessage(aiMessage.text, "ai");
            // Forcer un refetch après un court délai pour s'assurer que la liste est à jour
            setTimeout(() => {
              refetch();
            }, 200);
          } catch (error) {
            console.error("Error sending AI message:", error);
          }
        } else {
          setLocalMessages((prev) => [...prev, aiMessage]);
        }
        
        setIsTyping(false);
        
        if (isDemoTamara) {
          setAiResponseCount((prev) => prev + 1);
        }
        
        // Show notification for AI message (only if not muted)
        if (!isMuted) {
          showNotification({
            name: characterName,
            message: aiMessage.text,
            avatar: avatarUrl,
            conversationId: actualConversationId || id || undefined,
          });
        }
      } catch (error) {
        console.error("Error generating AI response:", error);
        setIsTyping(false);
        
        // Fallback message en cas d'erreur
        const fallbackMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: "Désolé, je rencontre un petit problème technique. Peux-tu réessayer ?",
          sender: "ai",
          timestamp: new Date(),
          read: false,
        };
        
        if (actualConversationId) {
          try {
            await sendMessage(fallbackMessage.text, "ai");
            setTimeout(() => {
              refetch();
            }, 200);
          } catch (err) {
            console.error("Error sending fallback message:", err);
          }
        } else {
          setLocalMessages((prev) => [...prev, fallbackMessage]);
        }
      }
    }, responseDelay);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-screen bg-background flex flex-col pb-16">
      {/* Header WhatsApp-style */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm z-10">
        <div className="px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {isMobile && (
              <Button
                size="icon"
                variant="ghost"
                onClick={() => navigate("/conversations")}
                className="rounded-full flex-shrink-0"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
            )}
            <Avatar className="w-10 h-10 flex-shrink-0">
              {avatarUrl && <AvatarImage src={avatarUrl} alt={characterName} />}
              <AvatarFallback className="bg-primary/20 text-primary">
                {characterName[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h2 className="font-semibold text-foreground truncate">
                {characterName}
              </h2>
              <p className={`text-xs ${isTyping ? 'text-primary animate-pulse' : 'text-muted-foreground'}`}>
                {isTyping ? "est en train d'écrire..." : "en ligne"}
              </p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="rounded-full flex-shrink-0"
              >
                <MoreVertical className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-card border-border">
              <DropdownMenuItem
                onClick={() => {
                  const newName = prompt("Nouveau nom de la conversation:", characterName);
                  if (newName && newName.trim()) {
                    toast({
                      title: "Conversation renommée",
                      description: `Renommée en "${newName}"`,
                    });
                  }
                }}
                className="cursor-pointer"
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Renommer
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setIsMuted(!isMuted);
                  toast({
                    title: isMuted ? "Notifications activées" : "Notifications désactivées",
                    description: isMuted 
                      ? "Vous recevrez à nouveau les notifications" 
                      : "Vous ne recevrez plus de notifications pour cette conversation",
                  });
                }}
                className="cursor-pointer"
              >
                {isMuted ? (
                  <>
                    <Bell className="w-4 h-4 mr-2" />
                    Activer les notifications
                  </>
                ) : (
                  <>
                    <BellOff className="w-4 h-4 mr-2" />
                    Mettre en sourdine
                  </>
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Messages WhatsApp-style */}
      <div 
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-scroll p-4 pr-2 bg-[hsl(var(--background))] relative scrollbar-custom"
      >
        <div className="max-w-4xl mx-auto space-y-2">
          {/* New conversation header - Pour toutes les conversations */}
          <>
            <div className="flex flex-col items-center justify-center py-8 animate-fade-in">
              <Avatar className="w-32 h-32 mb-4 ring-4 ring-border">
                {avatarUrl && <AvatarImage src={avatarUrl} alt={characterName} />}
                <AvatarFallback className="bg-primary/20 text-primary text-4xl">
                  {characterName[0]}
                </AvatarFallback>
              </Avatar>
              <h3 className="text-xl font-semibold text-foreground mb-1">{characterName}</h3>
              <p className="text-sm text-muted-foreground">
                {characterName} a démarré une discussion
              </p>
            </div>
            
            {/* Security message */}
            <div className="flex justify-center mb-4 animate-fade-in">
              <div className="max-w-[85%] bg-[#FCF4C4] dark:bg-[#3D3B30] px-4 py-3 rounded-lg shadow-sm">
                <p className="text-xs text-[#54504E] dark:text-[#D3D1CB] text-center leading-relaxed">
                  🔒 Les messages à vous-même sont chiffrés de bout en bout. Aucun tiers, pas même Lydia, ne peut les lire ou les écouter. Appuyez pour en savoir plus.
                </p>
              </div>
            </div>
          </>
          
          {displayMessages.map((message, index) => (
            <div key={message.id}>
              {/* Date separator */}
              {shouldShowDateSeparator(message, displayMessages[index - 1]) && (
                <div className="flex justify-center my-4">
                  <div className="bg-card/80 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-sm">
                    <span className="text-[11px] font-medium text-muted-foreground">
                      {getDateLabel(message.timestamp)}
                    </span>
                  </div>
                </div>
              )}
              
              {/* Message bubble */}
              <div
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                } animate-fade-in`}
              >
              <div
                className={`max-w-[80%] sm:max-w-[70%] rounded-2xl px-4 py-2.5 shadow-sm ${
                  message.sender === "user"
                    ? "bg-[hsl(var(--lydia-pink))] text-white rounded-br-sm"
                    : "bg-[hsl(var(--chat-ai))] text-foreground rounded-bl-sm"
                }`}
              >
                <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">
                  {message.text}
                </p>
                <div className="flex items-center justify-end gap-1 mt-1">
                  <span
                    className={`text-[10px] ${
                      message.sender === "user"
                        ? "text-white/70"
                        : "text-muted-foreground"
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString("fr-FR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  {message.sender === "user" && (
                    <div className="relative flex items-center ml-1">
                      <Check className={`w-4 h-4 absolute left-[3px] ${message.read ? 'text-blue-400' : 'text-white/70'} transition-colors duration-300`} strokeWidth={2.5} />
                      <Check className={`w-4 h-4 ${message.read ? 'text-blue-400' : 'text-white/70'} transition-colors duration-300`} strokeWidth={2.5} />
                    </div>
                  )}
                </div>
              </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start animate-fade-in">
              <div className="bg-[hsl(var(--chat-ai))] rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
        
        {/* Bouton pour revenir en bas */}
        {showScrollButton && (
          <button
            onClick={() => scrollToBottom(true)}
            className="fixed bottom-24 right-6 z-20 w-12 h-12 rounded-full bg-card border-2 border-border shadow-lg flex items-center justify-center hover:bg-accent transition-all duration-200 animate-fade-in"
            aria-label="Revenir en bas"
          >
            <ArrowDown className="w-5 h-5 text-foreground" />
          </button>
        )}
      </div>

      {/* Input WhatsApp-style */}
      <div className="border-t border-border bg-card/50 backdrop-blur-sm p-3 flex-shrink-0 z-20 mb-16">
        {!isAuthenticated && id === "demo-tamara" && messageCount >= 10 && (
          <div className="max-w-4xl mx-auto mb-3 bg-primary/10 border border-primary/20 rounded-2xl p-4 text-center animate-fade-in">
            <p className="text-sm text-foreground mb-3">
              Créer un compte ou connecte toi pour continuer à chater avec Tamara!
            </p>
            <Button
              onClick={() => navigate("/auth")}
              size="sm"
              className="w-full"
            >
              Se connecter / S'inscrire
            </Button>
          </div>
        )}
        <div className="max-w-4xl mx-auto flex items-end gap-2">
          <Button
            size="icon"
            variant="ghost"
            className="rounded-full flex-shrink-0 mb-1"
          >
            <Paperclip className="w-5 h-5 text-muted-foreground" />
          </Button>

          <div className="flex-1 bg-secondary rounded-3xl flex items-center gap-2 px-4 py-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Message..."
              className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-sm px-0"
            />
            <Button
              size="icon"
              variant="ghost"
              className="rounded-full flex-shrink-0 h-8 w-8"
            >
              <Smile className="w-5 h-5 text-muted-foreground" />
            </Button>
          </div>

          <Button
            onClick={handleSend}
            size="icon"
            className="rounded-full bg-primary hover:bg-primary/90 flex-shrink-0 mb-1"
            disabled={!inputValue.trim() || (!isAuthenticated && id === "demo-tamara" && messageCount >= 10)}
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatConversation;
