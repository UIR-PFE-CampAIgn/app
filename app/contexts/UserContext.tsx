'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { AppUserResponse } from '@/lib/types/user';
import { userService } from '@/lib/services/user.service';

interface UserContextType {
  user: AppUserResponse | null;
  setUser: (user: AppUserResponse | null) => void;
  isLoading: boolean;
  error: string | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUserResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const data = await userService.fetchCurrentUser();
        setUser(data);
      } catch (err) {
        console.error('Failed to fetch user:', err);
        setError(err instanceof Error ? err.message : 'Error loading user');
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, isLoading, error }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within UserProvider');
  return ctx;
}
