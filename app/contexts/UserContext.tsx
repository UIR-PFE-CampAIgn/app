'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createClient } from '@/lib/supabase/client';

interface UserContextType {
  userId: string | null;
  setUserId: (id: string | null) => void;
  isLoading: boolean;
  error: string | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        const supabase = createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError) {
          throw authError;
        }
        
        if (user) {
          setUserId(user.id);
        } else {
          setError('User not authenticated');
        }
      } catch (err) {
        console.error('Failed to get user:', err);
        setError(err instanceof Error ? err.message : 'Failed to authenticate');
      } finally {
        setIsLoading(false);
      }
    };

    getUser();

    // Optional: Listen for auth state changes
    const supabase = createClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUserId(session.user.id);
        setError(null);
      } else {
        setUserId(null);
        setError('User not authenticated');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const value = {
    userId,
    setUserId,
    isLoading,
    error,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

// Custom hook for using the context
export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}