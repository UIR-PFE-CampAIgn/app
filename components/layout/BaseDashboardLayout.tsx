'use client';
import React from "react";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import Link from "next/link";

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

interface BaseDashboardLayoutProps {
  children: React.ReactNode;
  navigation: NavSection[];
}

export default function BaseDashboardLayout({
  children,
  navigation,
}: BaseDashboardLayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar>
          {/* Sidebar Header */}
          <SidebarHeader className="border-b border-sidebar-border px-6 py-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-semibold">
                C
              </div>
              <div>
                <h2 className="font-semibold text-sidebar-foreground">
                  CampAIgn
                </h2>
                <p className="text-xs text-sidebar-foreground/60">
                  Marketing Automation
                </p>
              </div>
            </div>
          </SidebarHeader>

          {/* Dynamic navigation */}
          <SidebarContent>
            {navigation.map((section) => (
              <SidebarGroup key={section.title}>
                <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {section.items.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild>
                          <Link href={item.href}>
                            <item.icon className="h-4 w-4" />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            ))}
          </SidebarContent>

          {/* Sidebar Footer */}
          <SidebarFooter className="border-t border-sidebar-border p-4">
            <div className="flex items-center gap-3 px-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sidebar-accent text-sidebar-accent-foreground font-medium text-sm">
                U
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">
                  User
                </p>
                <p className="text-xs text-sidebar-foreground/60 truncate">
                  user@example.com
                </p>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </SidebarProvider>
  );
}
