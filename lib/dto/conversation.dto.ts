export type Platform = "whatsapp" | "instagram" | "messenger";
export type ChatStatus = "active" | "resolved" | "escalated";
export type Language = "english" | "darija" | "french" | "arabic";
export type Sentiment = "happy" | "neutral" | "frustrated" | "uncertain";

export class ConversationDTO {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  platform: Platform;
  status: ChatStatus;
  language: Language;
  sentiment: Sentiment;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  assignedAgent?: string;
  isAiHandled: boolean;

  constructor(data: {
    id: string;
    customerId: string;
    customerName?: string | null;
    customerPhone: string;
    platform: Platform;
    status?: ChatStatus | string;
    language?: Language;
    sentiment?: Sentiment;
    lastMessage?: string | null;
    lastMessageTime: Date | string;
    unreadCount?: number;
    assignedAgent?: string | null;
    isAiHandled?: boolean;
  }) {
    this.id = data.id;
    this.customerId = data.customerId;
    this.customerName = data.customerName ?? "Unknown";
    this.customerPhone = data.customerPhone;
    this.platform = data.platform;
    this.status = ["active", "resolved", "escalated"].includes(data.status || "")
      ? (data.status as ChatStatus)
      : "active";
    this.language = data.language ?? "english";
    this.sentiment = data.sentiment ?? "neutral";
    this.lastMessage = data.lastMessage ?? "";
    this.lastMessageTime =
      typeof data.lastMessageTime === "string"
        ? data.lastMessageTime
        : data.lastMessageTime.toISOString();
    this.unreadCount = data.unreadCount ?? 0;
    this.assignedAgent = data.assignedAgent ?? undefined;
    this.isAiHandled = data.isAiHandled ?? false;
  }
}
