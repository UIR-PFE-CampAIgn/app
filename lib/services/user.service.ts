// src/services/user.service.ts
import { createClient } from '@/lib/supabase/client';
import { userApi } from '@/lib/api/user';
import type {AppUserResponse } from '@/lib/types/user';

export const userService = {
  async fetchCurrentUser(): Promise<AppUserResponse> {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.access_token) {
      throw new Error('User not authenticated');
    }

    return await userApi.getCurrentUser();
  },
  updateProfile: async (data: Partial<AppUserResponse>): Promise<AppUserResponse> => {
    return userApi.updateProfile(data);
  },
  changePassword: async (newPassword: string): Promise<{ success: boolean }> => {
    return userApi.changePassword(newPassword);
  },
};
