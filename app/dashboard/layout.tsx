'use client';

import type React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { UserProvider } from '@/app/contexts/UserContext';
import { Dashboard } from '@/components/layout/Dashboard'; // Adjust path as needed

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserProvider>
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <Dashboard />
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </SidebarProvider>
    </UserProvider>
  );
}