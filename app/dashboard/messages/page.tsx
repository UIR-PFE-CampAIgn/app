"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Search, Filter, MessageCircle, Phone, ArrowUpRight, Send, MoreVertical, Clock, CheckCheck,
} from "lucide-react";
import { useChats } from "@/lib/hooks/use-chats";
import { useChatMessages } from "@/lib/hooks/use-chat-messages";
import { Chat, Message } from "@/lib/types/chat";

export default function InboxPage() {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("open");
  const [newMessage, setNewMessage] = useState("");

  const { chats, loading: chatsLoading, error: chatsError, fetchChats } = useChats();
  const { messages, loading: messagesLoading, fetchMessages, sendMessage } = useChatMessages(
    selectedChat?._id || ""
  );

  // Fetch chats on mount and when filters change
  useEffect(() => {
    fetchChats({
      businessId: 'default-business',
      status: statusFilter === 'all' ? undefined : statusFilter,
      search: searchTerm || undefined,
      limit: 50,
    });
  }, [fetchChats, statusFilter,searchTerm]);

  // Fetch messages when chat is selected
  useEffect(() => {
    if (selectedChat) {
      fetchMessages(50);
    }
  }, [selectedChat, fetchMessages]);

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm) {
        fetchChats({
          businessId: 'default-business',
          status: statusFilter === 'all' ? undefined : statusFilter,
          search: searchTerm,
        });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, statusFilter, fetchChats]);

  const filteredChats = chats;

  

 // Formats time like "2:45 PM"
const formatMessageTime = (timestamp: string) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
};

// Formats date like "Today", "Yesterday", or "6 Oct"
const formatMessageDate = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();

  const isToday =
    date.toDateString() === now.toDateString();

  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();

  if (isToday) return "Today";
  if (isYesterday) return "Yesterday";

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};


  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return;
    
    try {
      await sendMessage({
        text: newMessage,
        msg_type: 'text',
      });
      setNewMessage("");
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const getMessageSender = (msg: Message): 'customer' | 'ai' | 'agent' => {
    if (msg.direction === 'inbound') return 'customer';
    if (msg.ai_reply) return 'ai';
    return 'agent';
  };
  
  return (
    <div className="h-screen flex bg-gradient-to-br from-slate-50 to-slate-100/50">
      {/* Left Sidebar */}
      <div className="w-96 flex flex-col border-r bg-white/80 backdrop-blur-sm">
        {/* Header */}
        <div className="p-5 border-b bg-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
                Inbox
              </h1>
              <p className="text-sm text-slate-500 mt-0.5">
                {chatsLoading ? 'Loading...' : `${filteredChats.length} conversations`}
              </p>
            </div>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-slate-200 focus-visible:ring-slate-300"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex gap-2 mt-3">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-9 text-sm">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Error Message */}
        {chatsError && (
          <div className="p-4 bg-red-50 border-b border-red-200">
            <p className="text-sm text-red-600">{chatsError}</p>
          </div>
        )}

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {chatsLoading && (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          )}

          {!chatsLoading && filteredChats.length === 0 && (
            <div className="text-center p-8 text-slate-500">
              <MessageCircle className="h-12 w-12 mx-auto mb-3 text-slate-300" />
              <p>No conversations found</p>
            </div>
          )}

          {filteredChats.map((chat) => (
            <div
              key={chat._id}
              onClick={() => setSelectedChat(chat)}
              className={`p-4 border-b border-slate-100 cursor-pointer transition-all hover:bg-slate-50 relative ${
                selectedChat?._id === chat._id
                  ? "bg-blue-50/50 border-l-3 border-l-blue-500"
                  : ""
              }`}
            >
              <div className="flex gap-3">
                <div className="relative">
                  <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                    <AvatarImage
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${chat.lead_name}`}
                    />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                      {chat.lead_name?.[0] || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  {chat.unread_count && chat.unread_count > 0 && (
                    <div className="absolute -top-1 -right-1 h-5 w-5 bg-rose-500 rounded-full flex items-center justify-center text-xs text-white font-medium shadow-lg">
                      {chat.unread_count}
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-semibold text-slate-900 truncate">
                      {chat.lead_name || 'Unknown'}
                    </h4>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatMessageTime(chat.last_message?.created_at || chat.created_at)}
                    </span>
                  </div>
                  
                  <p className="text-sm text-slate-600 truncate mb-2">
                    {chat.last_message?.text || 'No messages yet'}
                  </p>
                  
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <Badge
                      variant={
                        chat.status === "open"
                          ? "default"
                          : chat.status === "archived"
                          ? "destructive"
                          : "secondary"
                      }
                      className="text-xs px-2 py-0.5 h-5"
                    >
                      {chat.status}
                    </Badge>
                    <Badge variant="outline" className="text-xs px-2 py-0.5 h-5">
                      {chat.message_count} msgs
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Side: Chat View */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b px-6 py-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-11 w-11 border-2 border-slate-100">
                    <AvatarImage
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedChat.lead_name}`}
                    />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                      {selectedChat.lead_name?.[0] || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-slate-900 text-lg">
                      {selectedChat.lead_name || 'Unknown'}
                    </h3>
                    <div className="flex items-center gap-3 text-sm text-slate-500">
                      <span className="flex items-center gap-1">
                        <Phone className="h-3.5 w-3.5" />
                        {selectedChat.lead_phone || 'N/A'}
                      </span>
                      <Badge variant="outline" className="text-xs h-5">
                        WhatsApp
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="rounded-full">
                    <ArrowUpRight className="h-4 w-4 mr-2" />
                    Profile
                  </Button>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-slate-50/50 to-white">
              {messagesLoading && (
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              )}

{messages.map((msg, idx) => {
  const sender = getMessageSender(msg);
  const prevMsg = messages[idx - 1];
  const showDateSeparator =
    !prevMsg ||
    new Date(prevMsg.created_at).toDateString() !==
      new Date(msg.created_at).toDateString();

  return (
    <div key={msg._id}>
      {showDateSeparator && (
        <div className="flex justify-center my-4">
          <span className="text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            {formatMessageDate(msg.created_at)}
          </span>
        </div>
      )}

      <div
        className={`flex ${
          sender === "customer" ? "justify-start" : "justify-end"
        } animate-in fade-in slide-in-from-bottom-2 duration-300`}
        style={{ animationDelay: `${idx * 50}ms` }}
      >
        <div
          className={`max-w-[75%] rounded-2xl px-4 py-3 shadow-sm ${
            sender === "customer"
              ? "bg-white border border-slate-200"
              : sender === "ai"
              ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white"
              : "bg-gradient-to-br from-slate-700 to-slate-800 text-white"
          }`}
        >
          <div className="flex items-center gap-2 mb-1.5">
            <span
              className={`text-xs font-medium ${
                sender === "customer"
                  ? "text-slate-700"
                  : "text-white/90"
              }`}
            >
              {sender === "customer"
                ? selectedChat.lead_name
                : sender === "ai"
                ? "AI Assistant"
                : "Agent"}
            </span>
          </div>

          <p
            className={`text-sm leading-relaxed ${
              sender === "customer" ? "text-slate-900" : "text-white"
            }`}
          >
            {msg.text}
          </p>

          <div
            className={`flex items-center justify-end gap-1 text-xs mt-2 ${
              sender === "customer" ? "text-slate-500" : "text-white/70"
            }`}
          >
            {formatMessageTime(msg.created_at)}
            {sender !== "customer" && <CheckCheck className="h-3 w-3 ml-1" />}
          </div>
        </div>
      </div>
    </div>
  );
})}

            </div>

            {/* Input */}
            <div className="border-t bg-white p-5">
              <div className="flex items-end gap-3 bg-slate-50 rounded-2xl p-3 border border-slate-200 focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                <Input
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
                  className="flex-1 border-0 bg-transparent focus-visible:ring-0 text-sm"
                />
                <Button 
                  onClick={handleSendMessage} 
                  disabled={!newMessage.trim()}
                  size="icon"
                  className="rounded-full h-10 w-10 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-md"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-slate-50 to-white">
            <div className="text-center">
              <div className="relative inline-block mb-6">
                <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-2xl"></div>
                <MessageCircle className="h-16 w-16 text-slate-300 relative" />
              </div>
              <h3 className="text-xl font-semibold text-slate-700 mb-2">
                No chat selected
              </h3>
              <p className="text-slate-500 max-w-sm">
                Pick a conversation from the list to start messaging
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}