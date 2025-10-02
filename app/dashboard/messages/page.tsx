"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Filter,
  MessageCircle,
  Phone,
  ArrowRightLeft,
  Bot,
  Smile,
  Frown,
  Meh,
  HelpCircle,
  ArrowUpRight,
  Send,
  MoreVertical,
  Clock,
  CheckCheck,
} from "lucide-react";

type Conversation = {
  id: string;
  customerName: string;
  customerPhone: string;
  platform: string;
  lastMessage: string;
  lastMessageTime: string;
  status: string;
  sentiment: string;
  isAiHandled: boolean;
  unreadCount: number;
  language: string;
};

const fakeConversations: Conversation[] = [
  {
    id: "1",
    customerName: "Alice Johnson",
    customerPhone: "+1 555-1234",
    platform: "whatsapp",
    lastMessage: "Thanks for your help!",
    lastMessageTime: new Date().toISOString(),
    status: "active",
    sentiment: "happy",
    isAiHandled: true,
    unreadCount: 2,
    language: "EN",
  },
  {
    id: "2",
    customerName: "Mark Lee",
    customerPhone: "+44 22 555",
    platform: "instagram",
    lastMessage: "Can you check this order?",
    lastMessageTime: new Date().toISOString(),
    status: "escalated",
    sentiment: "frustrated",
    isAiHandled: false,
    unreadCount: 0,
    language: "EN",
  },
  {
    id: "3",
    customerName: "Sarah Chen",
    customerPhone: "+1 555-9876",
    platform: "whatsapp",
    lastMessage: "Perfect, thank you!",
    lastMessageTime: new Date(Date.now() - 3600000).toISOString(),
    status: "resolved",
    sentiment: "happy",
    isAiHandled: true,
    unreadCount: 0,
    language: "EN",
  },
];

const fakeMessages = [
  {
    id: "m1",
    sender: "customer",
    content: "Hi, I need help with my order.",
    timestamp: new Date(Date.now() - 600000).toISOString(),
    sentiment: "uncertain",
  },
  {
    id: "m2",
    sender: "ai",
    content: "Sure! Could you share your order number?",
    timestamp: new Date(Date.now() - 540000).toISOString(),
  },
  {
    id: "m3",
    sender: "customer",
    content: "It's #4521.",
    timestamp: new Date(Date.now() - 480000).toISOString(),
    sentiment: "happy",
  },
  {
    id: "m4",
    sender: "ai",
    content: "Great! I found your order. It's currently being processed and should ship within 24 hours. You'll receive tracking information via email.",
    timestamp: new Date(Date.now() - 420000).toISOString(),
  },
  {
    id: "m5",
    sender: "customer",
    content: "Thanks for your help!",
    timestamp: new Date().toISOString(),
    sentiment: "happy",
  },
];

export default function InboxPage() {
  const [selectedChat, setSelectedChat] = useState<Conversation | null>(fakeConversations[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [newMessage, setNewMessage] = useState("");

  const filteredChats = fakeConversations.filter((chat) => {
    const matchesSearch =
      chat.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chat.lastMessage.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || chat.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getSentimentIcon = (sentiment?: string) => {
    switch (sentiment) {
      case "happy":
        return <Smile className="h-3.5 w-3.5 text-emerald-500" />;
      case "frustrated":
        return <Frown className="h-3.5 w-3.5 text-rose-500" />;
      case "uncertain":
        return <HelpCircle className="h-3.5 w-3.5 text-amber-500" />;
      default:
        return <Meh className="h-3.5 w-3.5 text-slate-400" />;
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      });
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    console.log("Send:", newMessage);
    setNewMessage("");
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
                {filteredChats.length} conversations
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
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="escalated">Escalated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {filteredChats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => setSelectedChat(chat)}
              className={`p-4 border-b border-slate-100 cursor-pointer transition-all hover:bg-slate-50 relative ${
                selectedChat?.id === chat.id
                  ? "bg-blue-50/50 border-l-3 border-l-blue-500"
                  : ""
              }`}
            >
              <div className="flex gap-3">
                <div className="relative">
                  <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                    <AvatarImage
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${chat.customerName}`}
                    />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                      {chat.customerName[0]}
                    </AvatarFallback>
                  </Avatar>
                  {chat.unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 h-5 w-5 bg-rose-500 rounded-full flex items-center justify-center text-xs text-white font-medium shadow-lg">
                      {chat.unreadCount}
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-semibold text-slate-900 truncate">
                      {chat.customerName}
                    </h4>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatTime(chat.lastMessageTime)}
                    </span>
                  </div>
                  
                  <p className="text-sm text-slate-600 truncate mb-2">
                    {chat.lastMessage}
                  </p>
                  
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <Badge
                      variant={
                        chat.status === "active"
                          ? "default"
                          : chat.status === "escalated"
                          ? "destructive"
                          : "secondary"
                      }
                      className="text-xs px-2 py-0.5 h-5"
                    >
                      {chat.status}
                    </Badge>
                    {chat.isAiHandled && (
                      <Badge variant="outline" className="text-xs px-2 py-0.5 h-5 border-blue-200 text-blue-700 bg-blue-50">
                        <Bot className="h-3 w-3 mr-1" />
                        AI
                      </Badge>
                    )}
                    {getSentimentIcon(chat.sentiment)}
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
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedChat.customerName}`}
                    />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                      {selectedChat.customerName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-slate-900 text-lg">
                      {selectedChat.customerName}
                    </h3>
                    <div className="flex items-center gap-3 text-sm text-slate-500">
                      <span className="flex items-center gap-1">
                        <Phone className="h-3.5 w-3.5" />
                        {selectedChat.customerPhone}
                      </span>
                      <Badge variant="outline" className="text-xs h-5">
                        {selectedChat.language}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="rounded-full">
                    <ArrowRightLeft className="h-4 w-4 mr-2" />
                    Escalate
                  </Button>
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
              {fakeMessages.map((msg, idx) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.sender === "customer" ? "justify-start" : "justify-end"
                  } animate-in fade-in slide-in-from-bottom-2 duration-300`}
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-3 shadow-sm ${
                      msg.sender === "customer"
                        ? "bg-white border border-slate-200"
                        : msg.sender === "ai"
                        ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white"
                        : "bg-gradient-to-br from-slate-700 to-slate-800 text-white"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`text-xs font-medium ${
                        msg.sender === "customer" ? "text-slate-700" : "text-white/90"
                      }`}>
                        {msg.sender === "customer"
                          ? selectedChat.customerName
                          : msg.sender === "ai"
                          ? "AI Assistant"
                          : "Agent"}
                      </span>
                      {msg.sender === "ai" && <Bot className="h-3.5 w-3.5 opacity-90" />}
                      {msg.sender === "customer" && msg.sentiment && getSentimentIcon(msg.sentiment)}
                    </div>
                    <p className={`text-sm leading-relaxed ${
                      msg.sender === "customer" ? "text-slate-900" : "text-white"
                    }`}>
                      {msg.content}
                    </p>
                    <div className={`flex items-center justify-end gap-1 text-xs mt-2 ${
                      msg.sender === "customer" ? "text-slate-500" : "text-white/70"
                    }`}>
                      {formatTime(msg.timestamp)}
                      {msg.sender !== "customer" && (
                        <CheckCheck className="h-3 w-3 ml-1" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
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