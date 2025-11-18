import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNotification } from "@/contexts/NotificationContext";
import { ArrowLeft, Send, MoreVertical, Paperclip, Smile } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
}

const ChatConversation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const { toast } = useToast();
  const { showNotification } = useNotification();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get preferences from location state or use default
  const preferences = location.state?.preferences || {};
  const characterName = preferences.characterName || "Sarah";
  const avatarUrl = preferences.avatarUrl;

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

    const isDemoConversation = id === "demo-tamara";
    const initialText = isDemoConversation
      ? "Bonjour.. ou salut je sais pas haha... Je viens d'emménager dans le quartier. Je connais pas grand monde en ville mais j'ai eu ton numéro par une amie. Ça te dérange pas si on continue à parler un peu :) ?"
      : "Hey... je voulais te parler de quelque chose. Tu as un moment ?";

    const initialMessage: Message = {
      id: "1",
      text: initialText,
      sender: "ai",
      timestamp: new Date(),
    };
    setMessages([initialMessage]);

    return () => subscription.unsubscribe();
  }, [id]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

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
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setMessageCount((prev) => prev + 1);
    setIsTyping(true);

    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "C'est intéressant ce que tu dis... Tu sais que j'ai toujours apprécié nos échanges.",
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
      
      // Show notification for AI message
      showNotification({
        name: characterName,
        message: aiMessage.text,
        avatar: avatarUrl,
      });
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header WhatsApp-style */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => navigate("/conversations")}
              className="rounded-full flex-shrink-0"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
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
              {isTyping && (
                <p className="text-xs text-primary animate-pulse">
                  En train d'écrire...
                </p>
              )}
            </div>
          </div>
          <Button
            size="icon"
            variant="ghost"
            className="rounded-full flex-shrink-0"
          >
            <MoreVertical className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Messages WhatsApp-style */}
      <div className="flex-1 overflow-y-auto p-4 bg-[hsl(var(--background))]">
        <div className="max-w-4xl mx-auto space-y-2">
          {messages.map((message) => (
            <div
              key={message.id}
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
                <span
                  className={`text-[10px] mt-1 block text-right ${
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
      </div>

      {/* Input WhatsApp-style */}
      <div className="border-t border-border bg-card/50 backdrop-blur-sm p-3">
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
