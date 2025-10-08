import { useState, useCallback } from 'react';
import { chatService } from '@/lib/services/chat.service';
import { Message, SendMessageDto } from '@/lib/types/chat';

export function useChatMessages(chatId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMessages = useCallback(async (limit = 50) => {
    if (!chatId) return;
    
    setLoading(true);
    setError(null);
    try {
      const data = await chatService.getMessages(chatId, limit);
      setMessages(data.reverse()); // Reverse to show oldest first
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch messages');
    } finally {
      setLoading(false);
    }
  }, [chatId]);

  const sendMessage = useCallback(async (data: SendMessageDto) => {
    if (!chatId) return;
    
    try {
      const newMessage = await chatService.sendMessage(chatId, data);
      setMessages(prev => [...prev, newMessage]);
      return newMessage;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
      throw err;
    }
  }, [chatId]);

  return {
    messages,
    loading,
    error,
    fetchMessages,
    sendMessage,
  };
}