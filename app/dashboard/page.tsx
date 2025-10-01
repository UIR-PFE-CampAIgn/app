import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BarChart3, MessageSquare, Users, TrendingUp } from "lucide-react";

const stats = [
  {
    title: "Total Businesses",
    value: "12",
    description: "Active businesses",
    icon: Users,
    trend: "+2 this month",
  },
  {
    title: "Active Campaigns",
    value: "8",
    description: "Running campaigns",
    icon: TrendingUp,
    trend: "+3 this week",
  },
  {
    title: "Messages Sent",
    value: "1,234",
    description: "Last 30 days",
    icon: MessageSquare,
    trend: "+12% from last month",
  },
  {
    title: "Total Leads",
    value: "456",
    description: "Captured leads",
    icon: BarChart3,
    trend: "+8% from last month",
  },
];

export default function DashboardPage() {
  return (
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
        {stats.map((stat) => (
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
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest campaign activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  action: "Campaign launched",
                  business: "Tech Startup Inc",
                  time: "2 hours ago",
                },
                {
                  action: "New lead captured",
                  business: "Fashion Boutique",
                  time: "5 hours ago",
                },
                {
                  action: "Message sent",
                  business: "Food Delivery Co",
                  time: "1 day ago",
                },
              ].map((activity, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 pb-4 border-b border-border last:border-0 last:pb-0"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      {activity.action}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {activity.business}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <button className="w-full flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-accent hover:text-accent-foreground transition-colors text-left">
                <TrendingUp className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Create New Campaign</p>
                  <p className="text-xs text-muted-foreground">
                    Launch a WhatsApp campaign
                  </p>
                </div>
              </button>
              <button className="w-full flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-accent hover:text-accent-foreground transition-colors text-left">
                <Users className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Add Business</p>
                  <p className="text-xs text-muted-foreground">
                    Register a new business
                  </p>
                </div>
              </button>
              <button className="w-full flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-accent hover:text-accent-foreground transition-colors text-left">
                <BarChart3 className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">View Analytics</p>
                  <p className="text-xs text-muted-foreground">
                    Check campaign performance
                  </p>
                </div>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
