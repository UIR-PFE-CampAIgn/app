"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Sparkles,
  Loader2,
  Target,
  MessageSquare,
  Calendar,
  Lightbulb,
  AlertTriangle,
  TrendingUp,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { toast } from "react-toastify";
import { useCampaignGenerator } from "@/lib/hooks/use-campaign-generator";
import {
  campaignGenerateFormSchema,
  defaultCampaignGenerateFormValues,
  type CampaignGenerateFormValues,
} from "@/lib/validators/campaign.validator";
import { useBusiness as useBusinessContext } from "@/app/contexts/BusinessContext";

const EXAMPLE_PROMPTS = [
  "I want to run a short flash sale for our annual subscriptions and offer 30% off to reward our loyal customers.",
  "Create an evening flash sale campaign targeting warm leads. The sale runs from 6 PM to midnight.",
];

export default function CampaignGeneratorPage() {
  const { businessId } = useBusinessContext();
  const {
    campaign,
    loading,
    error,
    generateCampaign,
    reset,
    handleCreateGeneratedCampaign,
  } = useCampaignGenerator();

  const [selectedPromptIndex, setSelectedPromptIndex] = useState<number | null>(null);
  const [savingGenerated, setSavingGenerated] = useState(false);
  const [campaignName, setCampaignName] = useState("");

  const form = useForm<CampaignGenerateFormValues>({
    resolver: zodResolver(campaignGenerateFormSchema),
    defaultValues: defaultCampaignGenerateFormValues,
  });

  useEffect(() => {
    if (businessId) {
      form.setValue("businessId", businessId);
    }
  }, [businessId, form]);

  const businessContextMissing = !businessId;

  const handleGenerate = async (values: CampaignGenerateFormValues) => {
    if (!businessId) {
      toast.error("Business context is missing.");
      return;
    }
    try {
      await generateCampaign({ ...values, businessId });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to generate campaign");
    }
  };

  const handleExampleClick = (prompt: string, index: number) => {
    form.setValue("prompt", prompt);
    setSelectedPromptIndex(index);
  };

  const handleStartNew = () => {
    reset();
    form.reset(defaultCampaignGenerateFormValues);
    setSelectedPromptIndex(null);
  };

  const formatDateTime = (dateTimeStr: string) => {
    const dt = new Date(dateTimeStr);
    return {
      date: dt.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" }),
      time: dt.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
    };
  };

  const handleSaveGeneratedCampaign = async () => {
    if (!businessId || !campaign) {
      toast.error("Missing business context or campaign details.");
      return;
    }

    try {
      setSavingGenerated(true);
      await handleCreateGeneratedCampaign(businessId, campaign ,campaignName);
      toast.success("Campaign saved successfully!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save generated campaign");
    } finally {
      setSavingGenerated(false);
    }
  };

  // ---------- Campaign Preview ----------
  if (campaign && !loading) {
    return (
      <div className="flex flex-col gap-6 p-6 md:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <Sparkles className="h-8 w-8 text-primary" />
              Campaign Preview
            </h1>
            <p className="text-muted-foreground mt-1">
              Review your AI-generated campaign strategy
            </p>
          </div>
          <Button variant="outline" onClick={handleStartNew}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Create New Campaign
          </Button>
        </div>

        <div className="space-y-4">
          {/* Strategy */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                <CardTitle>Campaign Strategy</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-2">Target Segments:</p>
                <div className="flex flex-wrap gap-2">
                  {campaign.strategy.target_segments.map((segment, i) => (
                    <Badge key={i} variant="secondary" className="uppercase">
                      {segment}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-1">Campaign Type:</p>
                <Badge variant="outline">{campaign.strategy.campaign_type}</Badge>
              </div>

              <div>
                <p className="text-sm font-medium mb-1">Key Message:</p>
                <p className="text-sm text-muted-foreground">{campaign.strategy.key_message}</p>
              </div>

              <div>
                <p className="text-sm font-medium mb-1">Reasoning:</p>
                <p className="text-sm text-muted-foreground">{campaign.strategy.reasoning}</p>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Expected Response Rates:</p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(campaign.strategy.expected_response_rates).map(([segment, rate]) => (
                    <Badge key={segment} variant="default">
                      {segment.toUpperCase()}: {rate}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Message Templates */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                <CardTitle>Message Template</CardTitle>
              </div>
              <CardDescription>
                {campaign.templates.length} template{campaign.templates.length !== 1 ? "s" : ""} generated
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {campaign.templates.map((template, index) => (
                <div key={index} className="border border-border rounded-lg p-4 space-y-2">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Template Type</p>
                    <Badge variant="outline" className="text-sm">{template.template_type}</Badge>
                  </div>
                  <div className="bg-muted/50 p-3 rounded text-sm font-mono whitespace-pre-wrap">
                    {template.message}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <span className="font-medium">Tip:</span> {template.personalization_tips}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Schedule */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <CardTitle>Send Schedule</CardTitle>
              </div>
              <CardDescription>
                {campaign.schedule.length} scheduled send{campaign.schedule.length !== 1 ? "s" : ""}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {campaign.schedule.map((item, index) => {
                const { date, time } = formatDateTime(item.send_datetime);
                return (
                  <div key={index} className="border border-border rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="uppercase">
                        {item.segment}
                      </Badge>
                      <Badge
                        variant={item.priority === "high" ? "destructive" : item.priority === "medium" ? "default" : "secondary"}
                      >
                        {item.priority} priority
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{date}</span>
                      <span className="text-muted-foreground">at</span>
                      <span className="font-medium">{time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{item.reasoning}</p>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Insights */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-primary" />
                <CardTitle>Campaign Insights</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <p className="text-sm font-medium">Success Factors</p>
                </div>
                <ul className="space-y-1 ml-6 list-disc">
                  {campaign.insights.success_factors.map((factor, i) => (
                    <li key={i} className="text-sm text-muted-foreground">{factor}</li>
                  ))}
                </ul>
              </div>
              <Separator />
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  <p className="text-sm font-medium">Warnings</p>
                </div>
                <ul className="space-y-1 ml-6 list-disc">
                  {campaign.insights.warnings.map((warning, i) => (
                    <li key={i} className="text-sm text-muted-foreground">{warning}</li>
                  ))}
                </ul>
              </div>
              <Separator />
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-4 w-4 text-blue-500" />
                  <p className="text-sm font-medium">Optimization Tips</p>
                </div>
                <ul className="space-y-1 ml-6 list-disc">
                  {campaign.insights.optimization_tips.map((tip, i) => (
                    <li key={i} className="text-sm text-muted-foreground">{tip}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex gap-4">
            <Card className="flex-1 border-primary/50 bg-primary/5">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold mb-1">Ready to launch?</p>
                    <p className="text-sm text-muted-foreground">
                      Save and deploy this campaign
                    </p>
                  </div>
                  <Button
                    onClick={handleSaveGeneratedCampaign}
                    disabled={savingGenerated || !businessId}
                  >
                    {savingGenerated ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        Save Campaign
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // ---------- Campaign Form ----------
  return (
    <div className="flex flex-col gap-6 p-6 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-primary" />
            AI Campaign Generator
          </h1>
          <p className="text-muted-foreground mt-1">
            Generate intelligent WhatsApp campaigns powered by AI
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Campaign Details</CardTitle>
          <CardDescription>
            Describe your campaign and let AI create the strategy
          </CardDescription>
        </CardHeader>
        <CardContent>
          {businessContextMissing && (
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Unable to determine business context. Make sure you access the generator from within a specific business dashboard.
              </AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <div className="space-y-4">
              {/* Campaign Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Campaign Name *</FormLabel>
                    <FormControl>
                      <input
                        {...field}
                        type="text"
                        placeholder="Enter a name for your campaign"
                        className="w-full border rounded px-2 py-1"
                        value={field.value ?? ""}
          onChange={(e) => {
            field.onChange(e);
            setCampaignName(e.target.value); // keep state updated
          }}

                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Campaign Prompt */}
              <FormField
                control={form.control}
                name="prompt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Campaign Prompt *</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        rows={6}
                        placeholder="Describe your campaign goals, target audience, and key message..."
                      />
                    </FormControl>
                    <FormDescription>
                      Be specific about your goals, audience, and timing
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Example Prompts */}
              <div className="space-y-2">
                <p className="text-sm font-medium">Example Prompts:</p>
                <div className="space-y-1">
                  {EXAMPLE_PROMPTS.map((prompt, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleExampleClick(prompt, index)}
                      className={`text-xs text-left w-full p-2 rounded border transition-colors ${
                        selectedPromptIndex === index
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-border hover:border-primary/50 text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {prompt.slice(0, 80)}...
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <Button
                onClick={form.handleSubmit(handleGenerate)}
                className="w-full"
                disabled={loading || businessContextMissing}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Campaign
                  </>
                )}
              </Button>
            </div>
          </Form>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <Loader2 className="h-12 w-12 text-primary mx-auto mb-4 animate-spin" />
              <h3 className="text-lg font-semibold mb-2">Generating Campaign...</h3>
              <p className="text-muted-foreground">AI is crafting your campaign strategy</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
