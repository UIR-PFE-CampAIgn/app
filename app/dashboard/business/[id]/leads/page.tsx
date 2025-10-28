"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Filter, Phone, Star, Flame, Snowflake } from "lucide-react";
import { useLeads } from "@/lib/hooks/use-leads";
import { useBusiness } from "@/app/contexts/BusinessContext";

// Helper function to get score styling
const getScoreStyling = (score?: string) => {
  switch (score?.toLowerCase()) {
    case 'hot':
      return {
        variant: 'destructive' as const,
        className: 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200',
        icon: Flame,
        label: 'Hot Lead'
      };
    case 'warm':
      return {
        variant: 'default' as const,
        className: 'bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200',
        icon: Star,
        label: 'Warm Lead'
      };
    case 'cold':
      return {
        variant: 'secondary' as const,
        className: 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200',
        icon: Snowflake,
        label: 'Cold Lead'
      };
    default:
      return {
        variant: 'outline' as const,
        className: 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200',
        icon: Star,
        label: 'Unscored'
      };
  }
};

export default function LeadsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Get businessId from context
  const { businessId } = useBusiness();
  console.log(businessId,"business")
  // Pass businessId to useLeads hook
  const { leads, loading, error, fetchLeads, searchLeads } = useLeads(businessId);

  // Load leads on mount
  useEffect(() => {
    if (businessId) {
      fetchLeads();
    }
  }, [fetchLeads, businessId]);

  // Handle search with debounce
  useEffect(() => {
    if (!businessId) return;
    
    const timer = setTimeout(() => {
      if (searchTerm) {
        searchLeads(searchTerm);
      } else {
        fetchLeads();
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, searchLeads, fetchLeads, businessId]);

  // No businessId state
  if (!businessId) {
    return (
      <div className="p-8">
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <p className="text-slate-600">No business selected</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Loading state
  if (loading && leads.length === 0) {
    return (
      <div className="p-8">
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-slate-600">Loading leads...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8">
      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <CardTitle className="text-2xl font-bold">
            Leads ({leads.length})
          </CardTitle>

          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        {/* Error State */}
        {error && (
          <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
            <Button
              onClick={() => fetchLeads()}
              variant="outline"
              size="sm"
              className="mt-2"
            >
              Retry
            </Button>
          </div>
        )}

        <CardContent className="space-y-3">
          {/* Loading indicator for search */}
          {loading && leads.length > 0 && (
            <div className="text-center py-2 text-sm text-slate-500">
              Searching...
            </div>
          )}

          {/* Leads List */}
          {leads.length === 0 && !loading ? (
            <div className="text-center py-12">
              <p className="text-slate-500 mb-2">No leads found</p>
              {searchTerm && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSearchTerm("")}
                >
                  Clear Search
                </Button>
              )}
            </div>
          ) : (
            leads.map((lead) => {
              const scoreStyling = getScoreStyling(lead.score);
              const ScoreIcon = scoreStyling.icon;
              
              return (
                <div
                  key={lead.id}
                  className="flex items-center justify-between p-4 rounded-lg border cursor-pointer hover:bg-muted/50 transition"
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${lead.display_name || lead.provider_user_id}`}
                      />
                      <AvatarFallback>
                        {lead.display_name
                          ? lead.display_name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()
                              .slice(0, 2)
                          : (lead.provider_user_id || 'UK').substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">
                        {lead.display_name || "Unknown"}
                      </h3>
                      <div className="flex items-center text-sm text-muted-foreground gap-2">
                        <Phone className="h-3 w-3" />
                        {lead.provider_user_id}
                        <Badge variant="secondary" className="text-xs">
                          {lead.provider}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={scoreStyling.variant}
                      className={`text-xs font-medium flex items-center gap-1 ${scoreStyling.className}`}
                    >
                      <ScoreIcon className="h-3 w-3" />
                      {scoreStyling.label}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {new Date(lead.created_at).toLocaleDateString()}
                    </Badge>
                  </div>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>
    </div>
  );
}