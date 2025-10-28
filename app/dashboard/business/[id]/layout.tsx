'use client';

import React from "react";
import { BusinessProvider } from "@/app/contexts/BusinessContext";

export default function BusinessLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = React.use(params);
  
  return (
    <BusinessProvider initialBusinessId={resolvedParams.id}>
      {children}
    </BusinessProvider>
  );
}