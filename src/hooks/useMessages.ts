import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  id: string;
  conversation_id: string;
  sender: 'user' | 'ai';
  content: string;
  created_at: string;
}

export const useMessages = (conversationId: string | null) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    if (!conversationId) {
      setMessages([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages((data || []) as Message[]);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();

    if (!conversationId) return;

    // S'abonner aux nouveaux messages en temps réel
    const channel = supabase
      .channel(`messages-${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`
        },
        (payload) => {
          setMessages((current) => [...current, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId]);

  const sendMessage = async (content: string, sender: 'user' | 'ai') => {
    if (!conversationId) throw new Error('No conversation selected');

    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender,
          content
        })
        .select()
        .single();

      if (error) throw error;

      // Mettre à jour le dernier message de la conversation
      const updateData: any = {
        last_message: content,
        last_message_time: new Date().toISOString()
      };
      
      // Si c'est l'IA qui envoie, incrémenter le compteur de messages non lus
      if (sender === 'ai') {
        // Récupérer le compteur actuel
        const { data: conv } = await supabase
          .from('conversations')
          .select('unread_count')
          .eq('id', conversationId)
          .single();
        
        updateData.unread_count = (conv?.unread_count || 0) + 1;
      }
      
      await supabase
        .from('conversations')
        .update(updateData)
        .eq('id', conversationId);

      return data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  };

  return {
    messages,
    loading,
    sendMessage,
    refetch: fetchMessages
  };
};
