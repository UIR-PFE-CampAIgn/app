// dtos/message.dto.ts
export class MessageDTO {
    id: string;
    chatId: string;
    content: string;
    sender: "customer" | "ai" | "agent";
    timestamp: string;
    isRead: boolean;
    sentiment?: "happy" | "neutral" | "frustrated" | "uncertain";
    intent?: string;
    direction: 'inbound' | 'outbound';
    senderId:string;
    conversationId:string;
  
    constructor(params: {
      id: string;
      chatId: string;
      content: string;
      sender: "customer" | "ai" | "agent";
      timestamp: string;
      isRead?: boolean;
      sentiment?: "happy" | "neutral" | "frustrated" | "uncertain";
      intent?: string;
      direction: 'inbound' | 'outbound';
      senderId:string;
      conversationId:string;
    }) {
      this.id = params.id;
      this.chatId = params.chatId;
      this.content = params.content;
      this.sender = params.sender;
      this.timestamp = params.timestamp;
      this.isRead = params.isRead ?? true; // default true
      this.sentiment = params.sentiment;
      this.intent = params.intent;
      this.direction = params.direction;
      this.senderId = params.senderId;
       this.conversationId=params.conversationId;
    }
  }
  