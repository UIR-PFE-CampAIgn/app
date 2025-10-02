"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Filter, Phone } from "lucide-react";

const fakeLeads = [
  { id: "1", name: "Alice Johnson", phone: "+123456789", createdAt: "2025-09-20T10:00:00Z" },
  { id: "2", name: "Bob Smith", phone: "+198765432", createdAt: "2025-09-21T15:30:00Z" },
  { id: "3", name: "Unknown", phone: "+111222333", createdAt: "2025-09-22T18:45:00Z" },
];

export default function LeadsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredLeads = fakeLeads.filter(
    (lead) =>
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone.includes(searchTerm)
  );

  return (
    <div className="p-8">
      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <CardTitle className="text-2xl font-bold">Leads ({filteredLeads.length})</CardTitle>

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

        <CardContent className="space-y-3">
          {filteredLeads.map((lead) => (
            <div
              key={lead.id}
              
              className="flex items-center justify-between p-4 rounded-lg border cursor-pointer hover:bg-muted/50 transition"
            >
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${lead.name}`}
                  />
                  <AvatarFallback>
                    {lead.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{lead.name}</h3>
                  <div className="flex items-center text-sm text-muted-foreground gap-1">
                    <Phone className="h-3 w-3" /> {lead.phone}
                  </div>
                </div>
              </div>
              <Badge variant="outline">
                {new Date(lead.createdAt).toLocaleDateString()}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
