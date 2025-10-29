'use client';
import { createContext, useContext, useState, ReactNode } from 'react';

interface BusinessContextType {
  businessId: string | null;
  setBusinessId: (id: string | null) => void;
}

const BusinessContext = createContext<BusinessContextType | undefined>(undefined);

export function BusinessProvider({
  children,
  initialBusinessId,
}: {
  children: ReactNode;
  initialBusinessId?: string;
}) {
  const [businessId, setBusinessId] = useState<string | null>(initialBusinessId || null);
  return (
    <BusinessContext.Provider value={{ businessId, setBusinessId }}>
      {children}
    </BusinessContext.Provider>
  );
}

export function useBusiness() {
  const context = useContext(BusinessContext);
  if (!context) {
    throw new Error('useBusiness must be used within a BusinessProvider');
  }
  return context;
}
