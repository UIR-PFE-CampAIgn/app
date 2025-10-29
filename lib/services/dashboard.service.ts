import { dashboardApi } from "@/lib/api/dashboard";
import { DashboardStats } from "@/lib/types/dashboard";

class DashboardService {
  /**
   * Fetch dashboard stats for a specific user.
   */
  async getStats(userId: string, days: number = 30): Promise<DashboardStats> {
    try {
      return await dashboardApi.getOverallStats(userId, days);
    } catch (error) {
      console.error("❌ Failed to fetch dashboard stats:", error);
      throw new Error("Unable to load dashboard data. Please try again later.");
    }
  }
}

export const dashboardService = new DashboardService();
