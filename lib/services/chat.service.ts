import { chatsApi } from '@/lib/api/chats';
import { Chat, Message, SendMessageDto, GetChatsParams, ChatsResponse } from '@/lib/types/chat';

class ChatService {
  private chatsCache: Map<string, Chat[]> = new Map();
  private messagesCache: Map<string, Message[]> = new Map();
  private cacheTimeout = 30 * 1000; // 30 seconds for real-time data

  async getAll(params?: GetChatsParams, forceRefresh = false): Promise<ChatsResponse> {
    const cacheKey = JSON.stringify(params || {});
    
    if (!forceRefresh && this.chatsCache.has(cacheKey)) {
      const cachedChats = this.chatsCache.get(cacheKey)!;
      return {
        chats: cachedChats,
        total: cachedChats.length,
        page: params?.page || 1,
        limit: params?.limit || 20,
      };
    }

    try {
      const response = await chatsApi.getAll(params);
      this.chatsCache.set(cacheKey, response.chats);
      
      setTimeout(() => this.chatsCache.delete(cacheKey), this.cacheTimeout);
      
      return response;
    } catch (error) {
      console.error('Failed to fetch chats:', error);
      throw new Error('Unable to load chats. Please try again.');
    }
  }

  async getMessages(chatId: string, limit = 50, forceRefresh = false) {
    if (!forceRefresh && this.messagesCache.has(chatId)) {
      return this.messagesCache.get(chatId)!;
    }

    try {
      const messages = await chatsApi.getMessages(chatId, limit);
      this.messagesCache.set(chatId, messages);
      
      setTimeout(() => this.messagesCache.delete(chatId), this.cacheTimeout);
      
      return messages;
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      throw new Error('Unable to load messages. Please try again.');
    }
  }

  async sendMessage(chatId: string, data: SendMessageDto) {
    try {
      const message = await chatsApi.sendMessage(chatId, data);
      
      // Invalidate caches
      this.messagesCache.delete(chatId);
      this.clearChatsCache();
      
      return message;
    } catch (error) {
      console.error('Failed to send message:', error);
      throw new Error('Unable to send message. Please try again.');
    }
  }

  async updateStatus(chatId: string, status: string) {
    try {
      await chatsApi.updateStatus(chatId, status);
      this.clearChatsCache();
    } catch (error) {
      console.error('Failed to update chat status:', error);
      throw new Error('Unable to update chat status. Please try again.');
    }
  }

  // Helper to format message for display
  formatMessage(message: Message) {
    return {
      id: message._id,
      chatId: message.chat_id,
      content: message.text || '',
      sender: message.direction === 'inbound' ? 'customer' : message.ai_reply ? 'ai' : 'agent',
      timestamp: message.created_at,
      direction: message.direction,
      msgType: message.msg_type,
      aiReply: message.ai_reply,
      campaignId: message.campaign_id,
    };
  }

  // Helper to format chat for display
  formatChat(chat: Chat) {
    return {
      id: chat._id,
      customerName: chat.lead_name || 'Unknown',
      customerPhone: chat.lead_phone || 'N/A',
      platform: 'whatsapp',
      lastMessage: chat.last_message?.text || 'No messages yet',
      lastMessageTime: chat.last_message?.created_at || chat.created_at,
      status: chat.status,
      unreadCount: chat.unread_count || 0,
      messageCount: chat.message_count,
    };
  }

  private clearChatsCache() {
    this.chatsCache.clear();
  }
}

export const chatService = new ChatService();
