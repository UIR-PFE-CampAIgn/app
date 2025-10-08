import { useState, useCallback } from 'react';
import { chatService } from '@/lib/services/chat.service';
import { Chat, GetChatsParams } from '@/lib/types/chat';

export function useChats() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  const fetchChats = useCallback(async (params?: GetChatsParams) => {
    setLoading(true);
    setError(null);
    try {
      const response = await chatService.getAll(params);
      setChats(response.chats);
      setTotal(response.total);
      setPage(response.page);
      setLimit(response.limit);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch chats');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateChatStatus = useCallback(async (chatId: string, status: string) => {
    try {
      await chatService.updateStatus(chatId, status);
      // Refresh chats after status update
      await fetchChats();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update status');
      throw err;
    }
  }, [fetchChats]);

  return {
    chats,
    loading,
    error,
    total,
    page,
    limit,
    fetchChats,
    updateChatStatus,
  };
}