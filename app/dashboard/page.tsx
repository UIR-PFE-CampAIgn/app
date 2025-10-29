'use client';
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import { Button } from "@/components/ui/button";
import { BarChart3, MessageSquare, Users, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { useBusinesses } from "@/lib/hooks/useBusinesses";
import { useDashboardStats } from "@/lib/hooks/useDashboardStats";


export default function DashboardPage() {
  const router = useRouter();
  const { businesses, loading } = useBusinesses();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState<string>("");
  const { stats } = useDashboardStats();

  const handleAddBusiness = () => {
    router.push(`/dashboard/business/`);
  };

  const handleCreateCampaign = () => {
    setIsDialogOpen(true);
  };

  const handleContinueToCampaign = () => {
    if (selectedBusiness) {
      router.push(`/dashboard/business/${selectedBusiness}/campaigns`);
      setIsDialogOpen(false);
      setSelectedBusiness("");
    }
  };
  const cards = [
    {
      title: "Total Businesses",
      value: stats?.totalBusinesses ?? "-",
      description: "Active businesses",
      icon: Users,
      trend: stats?.trends.businesses ?? "+0%",
    },
    {
      title: "Active Campaigns",
      value: stats?.activeCampaigns ?? "-",
      description: "Running campaigns",
      icon: TrendingUp,
      trend: stats?.trends.campaigns ?? "+0%",
    },
    {
      title: "Messages Sent",
      value: stats?.messagesSent?.toLocaleString() ?? "-",
      description: "Last 30 days",
      icon: MessageSquare,
      trend: stats?.trends.messages ?? "+0%",
    },
    {
      title: "Total Leads",
      value: stats?.totalLeads ?? "-",
      description: "Captured leads",
      icon: BarChart3,
      trend: stats?.trends.leads ?? "+0%",
    },
  ];

  return (
    <>
      <div className="flex flex-col gap-6 p-6 md:p-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here&apos;s an overview of your campaigns.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {cards.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {stat.value}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
                <p className="text-xs text-muted-foreground mt-2">{stat.trend}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
        <Card>
  <CardHeader>
    <CardTitle>Engagement Trends</CardTitle>
    <CardDescription>
      Messages and leads over the past 7 days
    </CardDescription>
  </CardHeader>
  <CardContent className="h-64">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={stats?.trendData ?? []}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
        <YAxis stroke="#9ca3af" fontSize={12} />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="messages"
          stroke="#3b82f6"
          strokeWidth={2}
          dot={{ r: 3 }}
        />
        <Line
          type="monotone"
          dataKey="leads"
          stroke="#10b981"
          strokeWidth={2}
          dot={{ r: 3 }}
        />
      </LineChart>
    </ResponsiveContainer>
  </CardContent>
</Card>
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <button
                  className="w-full flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-accent hover:text-accent-foreground transition-colors text-left"
                  onClick={handleCreateCampaign}
                >
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Create New Campaign</p>
                    <p className="text-xs text-muted-foreground">
                      Launch a WhatsApp campaign
                    </p>
                  </div>
                </button>
                <button
                  className="w-full flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-accent hover:text-accent-foreground transition-colors text-left"
                  onClick={handleAddBusiness}
                >
                  <Users className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Add Business</p>
                    <p className="text-xs text-muted-foreground">
                      Register a new business
                    </p>
                  </div>
                </button>
               
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Campaign Creation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Campaign</DialogTitle>
            <DialogDescription>
              Select a business to create a campaign for. You need to choose a
              business before proceeding.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label
                htmlFor="business-select"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Select Business
              </label>
              <Select
                value={selectedBusiness}
                onValueChange={setSelectedBusiness}
                disabled={loading}
              >
                <SelectTrigger id="business-select">
                  <SelectValue
                    placeholder={
                      loading
                        ? "Loading businesses..."
                        : businesses.length === 0
                        ? "No businesses available"
                        : "Choose a business"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {businesses.map((business) => (
                    <SelectItem key={business._id} value={business._id}>
                      {business.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {!loading && businesses.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  You need to add a business first.{" "}
                  <button
                    onClick={() => {
                      setIsDialogOpen(false);
                      handleAddBusiness();
                    }}
                    className="text-primary hover:underline"
                  >
                    Add one now
                  </button>
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDialogOpen(false);
                setSelectedBusiness("");
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleContinueToCampaign}
              disabled={!selectedBusiness}
            >
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
