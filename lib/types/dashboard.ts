export interface DashboardTrendPoint {
    date: string;
    messages: number;
    leads: number;
  }
  
  export interface DashboardTrends {
    businesses: string;
    campaigns: string;
    messages: string;
    leads: string;
  }
  
  export interface DashboardStats {
    totalBusinesses: number;
    activeCampaigns: number;
    messagesSent: number;
    totalLeads: number;
    trends: DashboardTrends;
    trendData: DashboardTrendPoint[];
  }
  