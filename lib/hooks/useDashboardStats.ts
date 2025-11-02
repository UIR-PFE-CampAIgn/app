"use client";

import { useEffect, useState } from "react";
import { dashboardService } from "@/lib/services/dashboard.service";
import { DashboardStats } from "@/lib/types/dashboard";
import { useUser } from "@/app/contexts/UserContext"; // adjust if your context differs

export function useDashboardStats(days: number = 30) {
    const { user } = useUser();
    const userId = user?.appUserData?.user_id; // from your backend DB
      const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    const fetchStats = async () => {
      try {
        setLoading(true);
        const result = await dashboardService.getStats(userId, days);
        setStats(result);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Failed to load dashboard data";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [userId, days]);

  return { stats, loading, error };
}
