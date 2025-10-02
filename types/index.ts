export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "admin" | "manager" | "agent";
  lastActive: string;
}

export interface Chat {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  platform: "whatsapp" | "instagram" | "messenger";
  status: "active" | "resolved" | "escalated";
  language: "darija" | "french" | "english" | "arabic";
  sentiment: "happy" | "neutral" | "frustrated" | "uncertain";
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  assignedAgent?: string;
  isAiHandled: boolean;
}

export interface Message {
  id: string;
  chatId: string;
  content: string;
  sender: "customer" | "ai" | "agent";
  timestamp: string;
  isRead: boolean;
  sentiment?: "happy" | "neutral" | "frustrated" | "uncertain";
  intent?: string;
}

export interface Campaign {
  id: string;
  name: string;
  status: "draft" | "scheduled" | "active" | "completed" | "paused";
  platform: "whatsapp" | "instagram" | "messenger" | "all";
  targetAudience: string;
  message: string;
  scheduledDate?: string;
  createdDate: string;
  sentCount: number;
  openRate: number;
  clickRate: number;
  conversionRate: number;
  budget: number;
  spent: number;
  isABTest: boolean;
  variants?: CampaignVariant[];
}

export interface CampaignVariant {
  id: string;
  name: string;
  message: string;
  image?: string;
  allocation: number; // percentage
  performance: {
    sent: number;
    opened: number;
    clicked: number;
    converted: number;
  };
}

export interface Template {
  id: string;
  name: string;
  category: string;
  language: "darija" | "french" | "english" | "arabic";
  content: string;
  placeholders: string[];
  isApproved: boolean;
  approvalStatus: "pending" | "approved" | "rejected";
  platform: "whatsapp" | "instagram" | "messenger";
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  discount: number;
  units: number;
  validUntil: string;
  targetSegments: string[];
  matchingScore?: number;
  predictedReach?: number;
  estimatedConversions?: number;
}

export interface Analytics {
  reach: number;
  openRate: number;
  responseRate: number;
  conversionRate: number;
  avgResponseTime: number;
  sentimentDistribution: {
    happy: number;
    neutral: number;
    frustrated: number;
    uncertain: number;
  };
  campaignPerformance: {
    date: string;
    sent: number;
    opened: number;
    clicked: number;
    converted: number;
  }[];
  chatVolume: {
    date: string;
    total: number;
    aiHandled: number;
    escalated: number;
  }[];
}

export interface KPI {
  title: string;
  value: string | number;
  change: number;
  changeType: "increase" | "decrease";
  period: string;
  icon: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
}

export interface Settings {
  whatsappApiKey: string;
  whatsappWebhookUrl: string;
  metaAccessToken: string;
  aiProvider: "openai" | "claude" | "local";
  aiApiKey: string;
  defaultLanguage: "darija" | "french" | "english" | "arabic";
  autoEscalationRules: {
    sentimentThreshold: number;
    unansweredTimeMinutes: number;
    complexQueryKeywords: string[];
  };
  businessHours: {
    enabled: boolean;
    timezone: string;
    schedule: {
      [key: string]: { start: string; end: string; enabled: boolean };
    };
  };
  notifications: {
    email: boolean;
    sms: boolean;
    inApp: boolean;
  };
}

// Business Models
export type SocialMediaPlatform =
  | "FACEBOOK"
  | "INSTAGRAM"
  | "WHATSAPP"
  | "TWITTER"
  | "LINKEDIN"
  | "TIKTOK"
  | "YOUTUBE"
  | "TELEGRAM"
  | "DISCORD"
  | "SNAPCHAT";

export interface Business {
  id: string;
  name: string;
  description?: string;
  industry?: string;
  website?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  timezone?: string;
  logoUrl?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  socialMediaPages?: BusinessSocialMedia[];
}

export interface BusinessSocialMedia {
  id: string;
  businessId: string;
  platform: SocialMediaPlatform;
  pageId: string;
  pageName: string;
  pageUsername?: string;
  pageUrl?: string;
  accessToken?: string;
  webhookUrl?: string;
  isVerified: boolean;
  isActive: boolean;
  lastSyncAt?: Date;
  syncFrequencyMinutes?: number;
  createdAt: Date;
  updatedAt: Date;
  business?: Business;
}

// Business creation/update types
export interface CreateBusinessInput {
  name: string;
  description?: string;
  industry?: string;
  website?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  timezone?: string;
  logoUrl?: string;
}

export interface UpdateBusinessInput extends Partial<CreateBusinessInput> {
  isActive?: boolean;
}

export interface CreateBusinessSocialMediaInput {
  businessId: string;
  platform: SocialMediaPlatform;
  pageId: string;
  pageName: string;
  pageUsername?: string;
  pageUrl?: string;
  accessToken?: string;
  webhookUrl?: string;
  syncFrequencyMinutes?: number;
}

export interface UpdateBusinessSocialMediaInput
  extends Partial<CreateBusinessSocialMediaInput> {
  isVerified?: boolean;
  isActive?: boolean;
  lastSyncAt?: Date;
}

// API Response Types
export interface ApiResponse<T = unknown> {
  status: number;
  body: T;
}

// Common response body types
export interface SuccessResponse<T = unknown> {
  ok: boolean;
  data?: T;
  message?: string;
}

export interface ErrorResponse {
  error: string;
  details?: unknown;
}

// Predefined response types for common use cases
export type ApiSuccessResponse<T> = ApiResponse<SuccessResponse<T>>;
export type ApiErrorResponse = ApiResponse<ErrorResponse>;

// Response Builder Class
export class ResponseBuilder<T = unknown> implements ApiResponse<T> {
  public status: number;
  public body: T;

  constructor(status: number, body: T) {
    this.status = status;
    this.body = body;
  }

  // Static factory methods for common response types
  static success<T>(
    data?: T,
    message?: string,
    status = 200
  ): ResponseBuilder<SuccessResponse<T>> {
    return new ResponseBuilder(status, {
      ok: true,
      data,
      message,
    });
  }

  static error(
    error: string,
    details?: unknown,
    status = 400
  ): ResponseBuilder<ErrorResponse> {
    return new ResponseBuilder(status, {
      error,
      details,
    });
  }

  static notFound(resource = "Resource"): ResponseBuilder<ErrorResponse> {
    return this.error(`${resource} not found`, undefined, 404);
  }

  static unauthorized(
    message = "Unauthorized"
  ): ResponseBuilder<ErrorResponse> {
    return this.error(message, undefined, 401);
  }

  static forbidden(message = "Forbidden"): ResponseBuilder<ErrorResponse> {
    return this.error(message, undefined, 403);
  }

  static internalError(
    message = "Internal server error"
  ): ResponseBuilder<ErrorResponse> {
    return this.error(message, undefined, 500);
  }

  static validationError(
    error: string,
    details?: unknown
  ): ResponseBuilder<ErrorResponse> {
    return this.error(error, details, 400);
  }

  static conflict(
    message = "Resource conflict"
  ): ResponseBuilder<ErrorResponse> {
    return this.error(message, undefined, 409);
  }

  // Method to convert to plain object (useful for API responses)
  toObject(): ApiResponse<T> {
    return {
      status: this.status,
      body: this.body,
    };
  }
}
