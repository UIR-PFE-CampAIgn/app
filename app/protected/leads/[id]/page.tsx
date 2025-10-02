"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Phone, ArrowLeft } from "lucide-react";

const fakeMessages: Record<string, any[]> = {
  "1": [
    { id: "m1", text: "Hello! I’m interested in your service.", sender: "customer", createdAt: "2025-09-20T10:15:00Z" },
    { id: "m2", text: "Hi Alice! Thanks for reaching out. How can I help?", sender: "agent", createdAt: "2025-09-20T10:16:00Z" },
  ],
  "2": [
    { id: "m1", text: "Can you tell me about pricing?", sender: "customer", createdAt: "2025-09-21T15:35:00Z" },
    { id: "m2", text: "Sure Bob! We have flexible packages starting at $99.", sender: "agent", createdAt: "2025-09-21T15:37:00Z" },
  ],
  "3": [
    { id: "m1", text: "Is this product still available?", sender: "customer", createdAt: "2025-09-22T19:00:00Z" },
  ],
};

export default function LeadConversationPage() {
  const { id } = useParams();
  const messages = fakeMessages[id as string] || [];
  const [newMessage, setNewMessage] = useState("");

  const handleSend = () => {
    if (!newMessage.trim()) return;
    console.log("Send:", newMessage);
    setNewMessage("");
  };

  return (
    <div className="p-8 flex flex-col h-[calc(100vh-4rem)]">
      <Card className="flex flex-col flex-1">
        {/* Header */}
        <CardHeader className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-3">
            <Button size="sm" variant="ghost">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Avatar>
              <AvatarImage
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Lead${id}`}
              />
              <AvatarFallback>L{id}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">Lead {id}</CardTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-3 w-3" /> +123456789
                <Badge variant="outline">New</Badge>
              </div>
            </div>
          </div>
          <Button variant="outline" size="sm">
            Profile
          </Button>
        </CardHeader>

        {/* Messages */}
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/20">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.sender === "customer" ? "justify-start" : "justify-end"
              }`}
            >
              <div
                className={`px-4 py-2 rounded-2xl max-w-xs shadow-sm ${
                  msg.sender === "customer"
                    ? "bg-white border text-gray-800"
                    : "bg-primary text-primary-foreground"
                }`}
              >
                <p className="text-sm">{msg.text}</p>
                <span className="text-xs opacity-70 block mt-1">
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          ))}
        </CardContent>

        {/* Input */}
        <div className="border-t p-4 flex items-center gap-2">
          <Input
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="flex-1"
          />
          <Button onClick={handleSend} disabled={!newMessage.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
}
