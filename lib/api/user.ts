import { apiClient } from "./axios-instance";
import { createClient } from "@/lib/supabase/client";
import type { AppUserResponse } from "@/lib/types/user";

export const userApi = {
  getCurrentUser: async (): Promise<AppUserResponse> => {
    const supabase = createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.access_token) {
      throw new Error("No Supabase session found");
    }

    const response = await apiClient.get<AppUserResponse>("/users/me", {
      headers: {
        Authorization: `Bearer ${session.access_token}`, // ✅ Important
      },
    });

    return response.data;
  },
  updateProfile: async (data: Partial<AppUserResponse>): Promise<AppUserResponse> => {
    const supabase = createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.access_token) {
      throw new Error("No Supabase session found");
    }
    console.log(data,'sdata')

    const response = await apiClient.put<AppUserResponse>('/users/me', data, {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });
    return response.data;
  },
  changePassword: async (newPassword: string): Promise<{ success: boolean }> => {
    const supabase = createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.access_token) {
      throw new Error("No Supabase session found");
    }

    const response = await apiClient.post<{ success: boolean }>("/users/change-password", 
      { newPassword },
      {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      }
    );

    return response.data;
  },
};
