import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MessageSquare,
  Users,
  TrendingUp,
  Settings,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

export default async function BusinessDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  // Mock data - in production, fetch based on params.id
  const business = {
    id,
    name: "Tech Startup Inc",
    industry: "Technology",
    description: "Innovative tech solutions for modern businesses",
    status: "active",
    campaigns: 3,
    leads: 145,
    messages: 892,
    conversionRate: "16.2%",
  };

  return (
    <div className="flex flex-col gap-6 p-6 md:p-8">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/business">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              {business.name}
            </h1>
            <Badge variant="secondary" className="capitalize">
              {business.status}
            </Badge>
          </div>
          <p className="text-muted-foreground">{business.description}</p>
        </div>
        <Button variant="outline">
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Campaigns
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {business.campaigns}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Running campaigns
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Leads
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {business.leads}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Captured leads</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Messages Sent
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {business.messages}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Total messages</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Conversion Rate
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {business.conversionRate}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Lead to customer
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Welcome Message</CardTitle>
            <CardDescription>Automated greeting for new leads</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg bg-muted p-4 space-y-3">
              <p className="text-sm text-foreground font-medium">Hello! 👋</p>
              <p className="text-sm text-foreground">
                Welcome to{" "}
                <span className="font-semibold">{business.name}</span>!
                We&apos;re excited to have you here.
              </p>
              <p className="text-sm text-foreground">
                We specialize in innovative tech solutions that help modern
                businesses grow and succeed. Our team is dedicated to providing
                you with the best service possible.
              </p>
              <p className="text-sm text-foreground">
                How can we help you today? Feel free to ask any questions, and
                we&apos;ll get back to you right away!
              </p>
            </div>
            <Button className="w-full mt-4 bg-transparent" variant="outline">
              Edit Welcome Message
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Campaigns</CardTitle>
            <CardDescription>Latest campaign activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  name: "Summer Sale 2025",
                  status: "active",
                  leads: 67,
                  sent: 234,
                },
                {
                  name: "Product Launch",
                  status: "active",
                  leads: 45,
                  sent: 189,
                },
                {
                  name: "Customer Feedback",
                  status: "completed",
                  leads: 33,
                  sent: 156,
                },
              ].map((campaign, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between pb-4 border-b border-border last:border-0 last:pb-0"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium text-foreground">
                        {campaign.name}
                      </p>
                      <Badge
                        variant={
                          campaign.status === "active" ? "default" : "secondary"
                        }
                        className="text-xs"
                      >
                        {campaign.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {campaign.leads} leads • {campaign.sent} messages sent
                    </p>
                  </div>
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </div>
              ))}
            </div>
            <Button className="w-full mt-4 bg-transparent" variant="outline">
              View All Campaigns
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
