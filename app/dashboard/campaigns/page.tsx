"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Search,
  Plus,
  Send,
  Clock,
  CheckCircle,
  XCircle,
  Users,
  Calendar,
  Play,
  Eye,
  Trash2,
  TrendingUp,
} from "lucide-react";
import { useCampaigns, useCampaignLogs } from "@/lib/hooks/use-campaigns";
import { useCampaignDialog } from "@/lib/hooks/use-campaign-dialog";
import { useTemplates } from "@/lib/hooks/use-templates";
import { campaignService } from "@/lib/services/campaign.service";
import { useLeads } from "@/lib/hooks/use-leads";
import { Checkbox } from "@/components/ui/checkbox";
export default function CampaignsPage() {
  const {
    campaigns,
    loading,
    error,
    fetchCampaigns,
    createCampaign,
    cancelCampaign,
  } = useCampaigns();

  const { templates, fetchTemplates } = useTemplates();
  
  const {
    open: isCreateOpen,
    setOpen: setIsCreateOpen,
    formData,
    setFormData,
    errors,
    validate,
    reset,
    prepareDto,
  } = useCampaignDialog();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLogsOpen, setIsLogsOpen] = useState(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
  const { leads, loading: leadsLoading, fetchLeads, searchLeads } = useLeads();
  const [isCancelOpen, setIsCancelOpen] = useState(false);
const [selectedCancelCampaign, setSelectedCancelCampaign] = useState<{ id: string; name: string } | null>(null);

const [leadSearchTerm, setLeadSearchTerm] = useState("");
  const { logs, loading: logsLoading, fetchLogs } = useCampaignLogs(selectedCampaignId);
  useEffect(() => {
    if (isCreateOpen) {
      fetchLeads();
    }
  }, [isCreateOpen, fetchLeads]);
  // Load data on mount
  useEffect(() => {
    fetchCampaigns();
    fetchTemplates();
  }, [fetchCampaigns, fetchTemplates]);

  // Filter campaigns
  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch = campaign.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || campaign.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    const colors = {
      draft: "bg-slate-100 text-slate-700 border-slate-200",
      scheduled: "bg-blue-100 text-blue-700 border-blue-200",
      running: "bg-yellow-100 text-yellow-700 border-yellow-200",
      completed: "bg-green-100 text-green-700 border-green-200",
      failed: "bg-red-100 text-red-700 border-red-200",
    };
    return colors[status as keyof typeof colors] || colors.draft;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "scheduled":
        return <Clock className="h-3.5 w-3.5" />;
      case "running":
        return <Play className="h-3.5 w-3.5" />;
      case "completed":
        return <CheckCircle className="h-3.5 w-3.5" />;
      case "failed":
        return <XCircle className="h-3.5 w-3.5" />;
      default:
        return null;
    }
  };

  const handleCreate = async () => {
    if (!validate()) return;

    try {
      const dto = prepareDto();
      await createCampaign(dto);
      setIsCreateOpen(false);
      reset();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to create campaign');
    }
  };

  const handleCancelConfirm = async () => {
    if (!selectedCancelCampaign) return;
    try {
      await cancelCampaign(selectedCancelCampaign.id);
      setIsCancelOpen(false);
      setSelectedCancelCampaign(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to cancel campaign');
    }
  };
  

  const viewLogs = async (campaignId: string) => {
    setSelectedCampaignId(campaignId);
    setIsLogsOpen(true);
  };

  useEffect(() => {
    if (isLogsOpen && selectedCampaignId) {
      fetchLogs();
    }
  }, [isLogsOpen, selectedCampaignId, fetchLogs]);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const selectedCampaign = campaigns.find(c => c._id === selectedCampaignId);

  // Loading state
  if (loading && campaigns.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100/50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-slate-600">Loading campaigns...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100/50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
                Broadcast Campaigns
              </h1>
              <p className="text-slate-600 mt-1">
                Schedule and manage your message campaigns
              </p>
            </div>
            <Button
              onClick={() => setIsCreateOpen(true)}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Campaign
            </Button>
          </div>

          {/* Search and Filters */}
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search campaigns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white border-slate-200"
              />
            </div>
            <Select value={statusFilter} onValueChange={(val) => {
              setStatusFilter(val);
              fetchCampaigns({ status: val !== 'all' ? val : undefined });
            }}>
              <SelectTrigger className="w-48 bg-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="running">Running</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
            <Button 
              onClick={() => fetchCampaigns()} 
              variant="outline" 
              size="sm" 
              className="mt-2"
            >
              Retry
            </Button>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-slate-200 bg-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Total Campaigns</p>
                  <p className="text-2xl font-bold text-slate-900">{campaigns.length}</p>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Send className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Active</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {campaigns.filter(c => c.status === 'running' || c.status === 'scheduled').length}
                  </p>
                </div>
                <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Play className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Messages Sent</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {campaigns.reduce((sum, c) => sum + c.sent_count, 0)}
                  </p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Success Rate</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {campaigns.length > 0 
                      ? Math.round((campaigns.reduce((sum, c) => sum + c.sent_count, 0) / 
                          campaigns.reduce((sum, c) => sum + c.total_recipients, 0)) * 100) || 0
                      : 0}%
                  </p>
                </div>
                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Campaigns List */}
        <div className="space-y-4">
          {filteredCampaigns.map((campaign) => {
            const template = templates.find(t => t.id === campaign.template_id);
            
            return (
              <Card key={campaign._id} className="border-slate-200 bg-white hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-slate-900">{campaign.name}</h3>
                        <Badge className={`text-xs ${getStatusColor(campaign.status)}`}>
                          <span className="flex items-center gap-1">
                            {getStatusIcon(campaign.status)}
                            {campaign.status}
                          </span>
                        </Badge>
                      </div>

                      <div className="flex items-center gap-6 text-sm text-slate-600 mb-4">
                        <span className="flex items-center gap-1">
                          <Send className="h-4 w-4" />
                          Template: {template?.name || 'Unknown'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {campaign.total_recipients} recipients
                        </span>
                        {campaign.scheduled_at && (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {formatDate(campaign.scheduled_at)}
                          </span>
                        )}
                      </div>

                      {/* Progress Bar */}
                      {(campaign.status === "running" || campaign.status === "completed") && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-600">Progress</span>
                            <span className="font-medium text-slate-900">
                              {campaign.sent_count} / {campaign.total_recipients}
                            </span>
                          </div>
                          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all"
                              style={{
                                width: `${campaignService.calculateProgress(campaign)}%`,
                              }}
                            />
                          </div>
                          <div className="flex items-center gap-4 text-xs text-slate-500">
                            <span className="flex items-center gap-1">
                              <CheckCircle className="h-3 w-3 text-green-600" />
                              {campaign.sent_count} sent
                            </span>
                            {campaign.failed_count > 0 && (
                              <span className="flex items-center gap-1">
                                <XCircle className="h-3 w-3 text-red-600" />
                                {campaign.failed_count} failed
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => viewLogs(campaign._id)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View Logs
                      </Button>
                      {(campaign.status === "draft" || campaign.status === "scheduled") && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => {
                            setSelectedCancelCampaign({ id: campaign._id, name: campaign.name });
                            setIsCancelOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredCampaigns.length === 0 && !loading && (
          <Card className="border-dashed border-2 bg-white">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Send className="h-16 w-16 text-slate-300 mb-4" />
              <h3 className="text-lg font-semibold text-slate-700 mb-2">
                No campaigns found
              </h3>
              <p className="text-slate-500 text-center max-w-sm mb-6">
                Create your first broadcast campaign to reach your audience
              </p>
              <Button onClick={() => setIsCreateOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Campaign
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Create Campaign Dialog */}
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Broadcast Campaign</DialogTitle>
              <DialogDescription>
                Schedule a message campaign to multiple recipients
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="campaign-name">Campaign Name</Label>
                <Input
                  id="campaign-name"
                  placeholder="e.g., Holiday Promotion"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="template">Message Template</Label>
                <Select
                  value={formData.template_id}
                  onValueChange={(value) => setFormData({ ...formData, template_id: value })}
                >
                  <SelectTrigger id="template">
                    <SelectValue placeholder="Select a template" />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.template_id && (
                  <p className="text-sm text-red-500">{errors.template_id}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="schedule-type">Schedule Type</Label>
                <Select
                  value={formData.schedule_type}
                  onValueChange={(value: typeof formData.schedule_type) => setFormData({ ...formData, schedule_type: value })}
                >
                  <SelectTrigger id="schedule-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediate">Send Immediately</SelectItem>
                    <SelectItem value="scheduled">Schedule for Later</SelectItem>
                    <SelectItem value="recurring">Recurring</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.schedule_type === "scheduled" && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.scheduled_date}
                      onChange={(e) => setFormData({ ...formData, scheduled_date: e.target.value })}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Time</Label>
                    <Input
                      id="time"
                      type="time"
                      value={formData.scheduled_time}
                      onChange={(e) => setFormData({ ...formData, scheduled_time: e.target.value })}
                    />
                  </div>
                </div>
              )}
              {errors.scheduled_date && (
                <p className="text-sm text-red-500">{errors.scheduled_date}</p>
              )}

              {/* Recipients Section - Replace existing one */}
<div className="space-y-2">
  <Label>Target Recipients</Label>
  
  {/* Search Leads */}
  <div className="relative">
    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
    <Input
      placeholder="Search leads..."
      value={leadSearchTerm}
      onChange={(e) => {
        setLeadSearchTerm(e.target.value);
        searchLeads(e.target.value);
      }}
      className="pl-10"
    />
  </div>

  {/* Leads List */}
  <div className="border rounded-lg max-h-60 overflow-y-auto">
    {leadsLoading ? (
      <div className="p-4 text-center text-sm text-slate-500">
        Loading leads...
      </div>
    ) : leads.length === 0 ? (
      <div className="p-4 text-center text-sm text-slate-500">
        No leads found
      </div>
    ) : (
      <div className="divide-y">
        {leads.map((lead) => (
  <div
    key={lead.id}
    className="flex items-center gap-3 p-3 hover:bg-slate-50 cursor-pointer"
    onClick={() => {
      const current = formData.target_leads;
      const newLeads = current.includes(lead.provider_user_id)
        ? current.filter(phone => phone !== lead.provider_user_id)
        : [...current, lead.provider_user_id];
      setFormData({ ...formData, target_leads: newLeads });
    }}
  >
    <Checkbox
      checked={formData.target_leads.includes(lead.provider_user_id)}
      onCheckedChange={() => {
        const current = formData.target_leads;
        const newLeads = current.includes(lead.provider_user_id)
          ? current.filter(phone => phone !== lead.provider_user_id)
          : [...current, lead.provider_user_id];
        setFormData({ ...formData, target_leads: newLeads });
      }}
    />
    <div className="flex-1 min-w-0">
      <p className="font-medium text-sm truncate">
        {lead.display_name || lead.provider_user_id}
      </p>
      <p className="text-xs text-slate-500">
        📞 {lead.provider_user_id} • {lead.provider}
      </p>
    </div>
  </div>
))}

      </div>
    )}
  </div>

  {/* Selection Summary */}
  <div className="flex items-center justify-between text-sm">
    <span className="text-slate-600">
      {formData.target_leads.length} recipient(s) selected
    </span>
    {formData.target_leads.length > 0 && (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setFormData({ ...formData, target_leads: [] })}
      >
        Clear All
      </Button>
    )}
  </div>

  {errors.target_leads && (
    <p className="text-sm text-red-500">{errors.target_leads}</p>
  )}
</div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreate}>
                Create Campaign
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Logs Dialog */}
        <Dialog open={isLogsOpen} onOpenChange={setIsLogsOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle>Campaign Logs - {selectedCampaign?.name}</DialogTitle>
              <DialogDescription>
                Detailed status of all messages in this campaign
              </DialogDescription>
            </DialogHeader>
            
            {logsLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="overflow-y-auto max-h-96">
                <table className="w-full">
                  <thead className="bg-slate-50 sticky top-0">
                    <tr className="text-left text-sm text-slate-600">
                      <th className="p-3">Lead ID</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Created At</th>
                      <th className="p-3">Error</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {logs.map((log) => (
                      <tr key={log._id} className="text-sm">
                        <td className="p-3 font-medium">{log.lead_id}</td>
                        <td className="p-3">
                          <Badge
                            variant={log.status === "sent" ? "default" : log.status === "failed" ? "destructive" : "secondary"}
                            className="text-xs"
                          >
                            {log.status}
                          </Badge>
                        </td>
                        <td className="p-3 text-slate-600">
                          {formatDate(log.created_at)}
                        </td>
                        <td className="p-3 text-red-600 text-xs">{log.error_message || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            <DialogFooter>
              <Button onClick={() => setIsLogsOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Cancel Campaign Confirmation Dialog */}
<Dialog open={isCancelOpen} onOpenChange={setIsCancelOpen}>
  <DialogContent className="max-w-md">
    <DialogHeader>
      <DialogTitle>Cancel Campaign</DialogTitle>
      <DialogDescription>
        Are you sure you want to cancel the campaign{" "}
        <span className="font-semibold text-slate-900">
          “{selectedCancelCampaign?.name}”
        </span>
        ? This action cannot be undone.
      </DialogDescription>
    </DialogHeader>

    <DialogFooter className="mt-4">
      <Button variant="outline" onClick={() => setIsCancelOpen(false)}>
        Keep Campaign
      </Button>
      <Button variant="destructive" onClick={handleCancelConfirm}>
        Yes, Cancel It
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

      </div>
    </div>
  );
}