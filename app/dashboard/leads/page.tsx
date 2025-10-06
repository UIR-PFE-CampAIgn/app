"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Filter, Phone } from "lucide-react";
import { useLeads } from "@/lib/hooks/use-leads";

export default function LeadsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { leads, loading, error, fetchLeads, searchLeads } = useLeads();

  // Load leads on mount
  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm) {
        searchLeads(searchTerm);
      } else {
        fetchLeads();
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, searchLeads, fetchLeads]);

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
            leads.map((lead) => (
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
    : (lead.provider_user_id || 'UK').substring(0, 2).toUpperCase()} {/* ✅ Fixed */}
</AvatarFallback>
                  </Avatar>
                  <div>
                  <h3 className="font-semibold">
  {lead.display_name || "Unknown"}
</h3>
<div className="flex items-center text-sm text-muted-foreground gap-2">
  <Phone className="h-3 w-3" />
  {lead.provider_user_id} {/* ✅ Use snake_case */}
  <Badge variant="secondary" className="text-xs">
    {lead.provider}
  </Badge>
</div>
                  </div>
                </div>
                <Badge variant="outline">
                  {new Date(lead.created_at).toLocaleDateString()}
                </Badge>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}