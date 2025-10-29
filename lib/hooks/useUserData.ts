'use client';

import { useEffect, useState, useCallback } from 'react';
import { userService } from '@/lib/services/user.service';
import type { AppUserResponse, AppUser, SupabaseUser } from '@/lib/types/user';

export type UpdateProfileInput = {
  appUserData?: Partial<AppUser>;
  supabaseUser?: Partial<SupabaseUser>;
};

export function useUserData() {
  const [user, setUser] = useState<AppUserResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      const data = await userService.fetchCurrentUser();
      setUser(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch user';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (
    updatedData: UpdateProfileInput
  ) => {
    try {
      setLoading(true);
      const updatedUser = await userService.updateProfile(updatedData as Partial<AppUserResponse>);
      setUser(updatedUser);
      return updatedUser;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to update profile';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  const changePassword = useCallback(async (newPassword: string) => {
    try {
      setLoading(true);
      await userService.changePassword(newPassword);
      return { success: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to change password';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return { user, loading, error, fetchUser, updateProfile ,changePassword };
}
