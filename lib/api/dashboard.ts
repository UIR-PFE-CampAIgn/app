import { apiClient } from "./axios-instance";
import { DashboardStats } from "@/lib/types/dashboard";

export const dashboardApi = {
  /**
   * Get overall dashboard statistics for the given user.
   */
  async getOverallStats(userId: string, days: number = 30): Promise<DashboardStats> {
    const response = await apiClient.get<DashboardStats>("/dashboard/stats", {
      params: { userId, days },
    });
    return response.data;
  }
};
