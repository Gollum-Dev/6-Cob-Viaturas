import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { ChatMessage, UserRole } from '../types';

interface ChatContextType {
  messages: ChatMessage[];
  unreadCount: number;
  isLoading: boolean;
  isLocalFallback: boolean;
  sendMessage: (content: string, receiverId: string | null) => Promise<void>;
  markAsRead: (chatPartnerId: string) => Promise<void>;
  refetchMessages: () => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLocalFallback, setIsLocalFallback] = useState(false);

  // Helper to get local messages from localStorage
  const getLocalMessages = (): ChatMessage[] => {
    try {
      const stored = localStorage.getItem('viaturabm_local_chat_messages');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error('Error reading local messages:', e);
      return [];
    }
  };

  // Helper to save local messages to localStorage
  const saveLocalMessages = (newMessages: ChatMessage[]) => {
    try {
      localStorage.setItem('viaturabm_local_chat_messages', JSON.stringify(newMessages));
      setMessages(newMessages);
    } catch (e) {
      console.error('Error saving local messages:', e);
    }
  };

  const fetchMessages = async () => {
    if (!user) return;

    try {
      // Attempt to query Supabase
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        // Table doesn't exist, fall back to local storage
        if (error.code === 'PGRST205' || error.message.includes('Could not find the table')) {
          console.warn('Chat messages table not found in Supabase. Using LocalStorage fallback.');
          setIsLocalFallback(true);
          setMessages(getLocalMessages());
        } else {
          throw error;
        }
      } else if (data) {
        setIsLocalFallback(false);
        setMessages(data as ChatMessage[]);
      }
    } catch (err) {
      console.error('Error fetching chat messages, using local fallback:', err);
      setIsLocalFallback(true);
      setMessages(getLocalMessages());
    } finally {
      setIsLoading(false);
    }
  };

  // Real-time synchronization
  useEffect(() => {
    if (!user) {
      setMessages([]);
      setIsLoading(false);
      return;
    }

    fetchMessages();

    if (isLocalFallback) return;

    // Listen for real-time insert/update events on public.messages
    const channel = supabase
      .channel('messages-realtime-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'messages' },
        (payload) => {
          console.log('Realtime chat update:', payload);
          fetchMessages();
        }
      )
      .subscribe((status) => {
        console.log('Realtime subscription status:', status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, isLocalFallback]);

  // Local storage listener for multi-tab fallback support
  useEffect(() => {
    if (!isLocalFallback) return;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'viaturabm_local_chat_messages') {
        setMessages(getLocalMessages());
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [isLocalFallback]);

  // Calculate unread count for the logged-in user
  const unreadCount = useMemo(() => {
    if (!user) return 0;
    
    const isAdmin = user.role === UserRole.ADMINISTRADOR;

    return messages.filter((msg) => {
      if (msg.is_read) return false;

      if (isAdmin) {
        // Admins see all unread messages sent to "Administrators" (receiver_id is null)
        return msg.receiver_id === null && msg.sender_id !== user.id;
      } else {
        // Normal users only see unread messages sent directly to them
        return msg.receiver_id === user.id;
      }
    }).length;
  }, [messages, user]);

  // Send message function
  const sendMessage = async (content: string, receiverId: string | null) => {
    if (!user || !content.trim()) return;

    const newMessageData = {
      sender_id: user.id,
      receiver_id: receiverId,
      content: content.trim(),
      is_read: false,
      sender_name: user.name,
      sender_rank: user.rank,
    };

    if (isLocalFallback) {
      const localMsg: ChatMessage = {
        id: crypto.randomUUID(),
        ...newMessageData,
        created_at: new Date().toISOString(),
      };
      const updated = [...getLocalMessages(), localMsg];
      saveLocalMessages(updated);
    } else {
      try {
        const { error } = await supabase.from('messages').insert([newMessageData]);
        if (error) throw error;
        // The real-time listener will trigger fetchMessages() automatically
      } catch (err) {
        console.error('Failed to send database message, sending locally:', err);
        // Instant local backup
        const localMsg: ChatMessage = {
          id: crypto.randomUUID(),
          ...newMessageData,
          created_at: new Date().toISOString(),
        };
        const updated = [...getLocalMessages(), localMsg];
        saveLocalMessages(updated);
        setIsLocalFallback(true);
      }
    }
  };

  // Mark all messages as read for a specific thread
  const markAsRead = async (chatPartnerId: string) => {
    if (!user) return;

    const isAdmin = user.role === UserRole.ADMINISTRADOR;

    // Immediately update local state so the unread badge vanishes instantly in the UI
    setMessages((prev) => 
      prev.map((msg) => {
        const shouldMark = isAdmin
          ? msg.sender_id === chatPartnerId && msg.receiver_id === null
          : msg.receiver_id === user.id; // Normal user reads all messages sent to them

        if (shouldMark && !msg.is_read) {
          return { ...msg, is_read: true };
        }
        return msg;
      })
    );

    if (isLocalFallback) {
      const allMsgs = getLocalMessages();
      const updated = allMsgs.map((msg) => {
        const shouldMark = isAdmin
          ? msg.sender_id === chatPartnerId && msg.receiver_id === null
          : msg.receiver_id === user.id;

        if (shouldMark && !msg.is_read) {
          return { ...msg, is_read: true };
        }
        return msg;
      });
      saveLocalMessages(updated);
    } else {
      try {
        let query = supabase.from('messages').update({ is_read: true });

        if (isAdmin) {
          // Admin reads messages sent by the normal user (chatPartnerId) to admins (receiver_id is null)
          query = query
            .eq('sender_id', chatPartnerId)
            .is('receiver_id', null)
            .eq('is_read', false);
        } else {
          // Normal user reads all messages sent to them
          query = query
            .eq('receiver_id', user.id)
            .eq('is_read', false);
        }

        const { error } = await query;
        if (error) throw error;
      } catch (err) {
        console.error('Failed to update messages as read in database:', err);
      }
    }
  };

  return (
    <ChatContext.Provider value={{
      messages,
      unreadCount,
      isLoading,
      isLocalFallback,
      sendMessage,
      markAsRead,
      refetchMessages: fetchMessages,
    }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}
