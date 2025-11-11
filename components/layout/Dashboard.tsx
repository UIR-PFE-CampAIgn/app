"use client";

import { usePathname } from "next/navigation";
import {
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
import {
  LayoutDashboard,
  Building2,
  Settings,
  Zap,
  MessageSquare,
  Users,
  LayoutTemplate,
  ArrowLeft,
  Briefcase,
} from "lucide-react";
import Link from "next/link";
import { useUser } from "@/app/contexts/UserContext";

export function Dashboard() {
  const pathname = usePathname();
  const { user } = useUser();

  // Extract business ID from pathname if exists
  const businessMatch = pathname.match(/\/dashboard\/business\/([^\/]+)/);
  const businessId = businessMatch ? businessMatch[1] : null;
  const base = businessId ? `/dashboard/business/${businessId}` : "";

  // Determine which navigation to show
  const navigation = businessId
    ? [
        {
          title: "Back",
          items: [
            {
              title: "All Businesses",
              href: "/dashboard/business",
              icon: ArrowLeft,
            },
          ],
        },
        {
          title: "Overview",
          items: [{ title: "Overview", href: base, icon: LayoutDashboard }],
        },
        {
          title: "Business Management",
          items: [
            { title: "Chats", href: `${base}/messages`, icon: MessageSquare },
            { title: "Leads", href: `${base}/leads`, icon: Users },
            {
              title: "Message Templates",
              href: `${base}/templates`,
              icon: LayoutTemplate,
            },
            { title: "Campaigns", href: `${base}/campaigns`, icon: Zap },
            {
              title: "Business Details",
              href: `${base}/BuisnessManagement`,
              icon: Briefcase,
            },
          ],
        },
        {
          title: "Settings",
          items: [
            { title: "Settings", href: "/dashboard/settings", icon: Settings },
          ],
        },
      ]
    : [
        {
          title: "Overview",
          items: [
            { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
            {
              title: "Businesses",
              href: "/dashboard/business",
              icon: Building2,
            },
          ],
        },
        {
          title: "Settings",
          items: [
            { title: "Settings", href: "/dashboard/settings", icon: Settings },
          ],
        },
      ];

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-semibold">
            C
          </div>
          <div>
            <h2 className="font-semibold text-sidebar-foreground">CampAIgn</h2>
            <p className="text-xs text-sidebar-foreground/60">
              Marketing Automation
            </p>
          </div>
        </div>
      </SidebarHeader>
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
      <SidebarFooter className="border-t border-sidebar-border p-4">
        {user ? (
          <div className="flex items-center gap-3 px-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sidebar-accent text-sidebar-accent-foreground font-medium text-sm">
              {user.appUserData.fullname?.[0] ||
                user.supabaseUser.email[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">
                {user.appUserData.fullname || user.supabaseUser.email}
              </p>
              <p className="text-xs text-sidebar-foreground/60 truncate">
                {user.supabaseUser.email}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-sidebar-foreground">Loading user...</p>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
