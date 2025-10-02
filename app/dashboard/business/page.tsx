import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Plus, ArrowRight } from "lucide-react";
import Link from "next/link";

const businesses = [
  {
    id: "1",
    name: "Tech Startup Inc",
    industry: "Technology",
    campaigns: 3,
    leads: 145,
    status: "active",
    description: "Innovative tech solutions for modern businesses",
  },
  {
    id: "2",
    name: "Fashion Boutique",
    industry: "Retail",
    campaigns: 2,
    leads: 89,
    status: "active",
    description: "Premium fashion and lifestyle products",
  },
  {
    id: "3",
    name: "Food Delivery Co",
    industry: "Food & Beverage",
    campaigns: 1,
    leads: 234,
    status: "active",
    description: "Fast and reliable food delivery service",
  },
  {
    id: "4",
    name: "Fitness Studio",
    industry: "Health & Wellness",
    campaigns: 2,
    leads: 67,
    status: "active",
    description: "Personal training and group fitness classes",
  },
  {
    id: "5",
    name: "Real Estate Agency",
    industry: "Real Estate",
    campaigns: 4,
    leads: 178,
    status: "active",
    description: "Residential and commercial property solutions",
  },
  {
    id: "6",
    name: "Digital Marketing Co",
    industry: "Marketing",
    campaigns: 5,
    leads: 312,
    status: "active",
    description: "Full-service digital marketing agency",
  },
];

export default function BusinessesPage() {
  return (
    <div className="flex flex-col gap-6 p-6 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Businesses
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage all your business accounts and campaigns
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Business
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {businesses.map((business) => (
          <Link key={business.id} href={`/dashboard/business/${business.id}`}>
            <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Building2 className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">
                        {business.name}
                      </CardTitle>
                      <CardDescription className="text-xs mt-1">
                        {business.industry}
                      </CardDescription>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {business.description}
                </p>
                <div className="flex items-center gap-4 pt-4 border-t border-border">
                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      {business.campaigns}
                    </p>
                    <p className="text-xs text-muted-foreground">Campaigns</p>
                  </div>
                  <div className="h-8 w-px bg-border" />
                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      {business.leads}
                    </p>
                    <p className="text-xs text-muted-foreground">Leads</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
