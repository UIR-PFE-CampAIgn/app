"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Phone, 
  MessageSquare, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight,
  Loader2,
  Info,
  X
} from "lucide-react";
import { useRouter } from "next/navigation";

interface WhatsAppIntegrationProps {
  businessId?: string;
  businessName?: string;
}

export default function WhatsAppIntegration({ businessId, businessName }: WhatsAppIntegrationProps) {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [step, setStep] = useState<"phone" | "verify" | "complete">("phone");
  const [isLoading, setIsLoading] = useState(false);

  const handlePhoneSubmit = () => {
    if (!phoneNumber) return;
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setStep("verify");
    }, 1500);
  };

  const handleVerifySubmit = () => {
    if (verificationCode.length !== 6) return;
    setIsLoading(true);
    
    // Simulate verification
    setTimeout(() => {
      setIsLoading(false);
      setStep("complete");
    }, 1500);
  };

  const handleSkip = () => {
    if (businessId) {
      router.push(`/dashboard/business/${businessId}`);
    } else {
      router.push('/dashboard/businesses');
    }
  };

  const handleComplete = () => {
    if (businessId) {
      router.push(`/dashboard/business/${businessId}`);
    } else {
      router.push('/dashboard/businesses');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 p-6 flex items-center justify-center relative">
      {/* Close button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4"
        onClick={handleSkip}
      >
        <X className="h-5 w-5" />
      </Button>

      <div className="w-full max-w-2xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
            <MessageSquare className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            Connect WhatsApp Business
          </h1>
          <p className="text-gray-600">
            {businessName ? `Set up WhatsApp for ${businessName}` : 'Enable WhatsApp messaging for your business to communicate with leads'}
          </p>
        </div>

        {/* Demo Notice */}
        <Alert className="border-blue-200 bg-blue-50">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <strong>Demo Mode:</strong> This is a preview of the WhatsApp integration flow. 
            Full functionality requires upgrading to Twilio&apos;s paid plan.
          </AlertDescription>
        </Alert>

        {/* Main Card */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>
              {step === "phone" && "Enter Your Business Phone Number"}
              {step === "verify" && "Verify Your Phone Number"}
              {step === "complete" && "Connection Successful!"}
            </CardTitle>
            <CardDescription>
              {step === "phone" && "We'll send a verification code to this number"}
              {step === "verify" && "Enter the 6-digit code sent to your phone"}
              {step === "complete" && "Your WhatsApp Business account is now connected"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Step 1: Phone Number */}
            {step === "phone" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Business Phone Number</Label>
                  <div className="flex gap-2">
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="flex-1"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handlePhoneSubmit();
                      }}
                    />
                    <Button onClick={handlePhoneSubmit} disabled={isLoading || !phoneNumber}>
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          Send Code
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div className="text-sm text-gray-600">
                      <p className="font-medium mb-1">Requirements:</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Must be a valid phone number</li>
                        <li>Should have WhatsApp Business installed</li>
                        <li>Number should not be used by another account</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  onClick={handleSkip}
                  className="w-full"
                >
                  Skip for now
                </Button>
              </div>
            )}

            {/* Step 2: Verification */}
            {step === "verify" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="code">Verification Code</Label>
                  <Input
                    id="code"
                    type="text"
                    placeholder="000000"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    maxLength={6}
                    className="text-center text-2xl tracking-widest"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleVerifySubmit();
                    }}
                  />
                </div>

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Code sent to {phoneNumber}. It may take a few minutes to arrive.
                  </AlertDescription>
                </Alert>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setStep("phone")}
                    className="flex-1"
                  >
                    Change Number
                  </Button>
                  <Button 
                    onClick={handleVerifySubmit} 
                    disabled={isLoading || verificationCode.length !== 6}
                    className="flex-1"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Verify"
                    )}
                  </Button>
                </div>

                <Button
                  variant="link"
                  className="w-full text-sm"
                  onClick={() => alert("Resending code... (Demo)")}
                >
                  Didn&apos;t receive the code? Resend
                </Button>
              </div>
            )}

            {/* Step 3: Complete */}
            {step === "complete" && (
              <div className="space-y-6 text-center py-8">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100">
                  <CheckCircle2 className="w-10 h-10 text-green-600" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-gray-900">
                    WhatsApp Connected Successfully!
                  </h3>
                  <p className="text-gray-600">
                    {phoneNumber} is now connected to your business
                  </p>
                </div>

                <div className="bg-green-50 rounded-lg p-4 space-y-3">
                  <p className="font-medium text-green-900">What&apos;s next?</p>
                  <ul className="text-sm text-green-800 space-y-2 text-left">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>Create campaigns to engage with leads</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>Send automated WhatsApp messages</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>Track message delivery and responses</span>
                    </li>
                  </ul>
                </div>

                <Button onClick={handleComplete} className="w-full" size="lg">
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Progress Indicator */}
        <div className="flex justify-center gap-2">
          <div className={`h-2 w-2 rounded-full transition-colors ${step === "phone" ? "bg-green-600" : "bg-gray-300"}`} />
          <div className={`h-2 w-2 rounded-full transition-colors ${step === "verify" ? "bg-green-600" : "bg-gray-300"}`} />
          <div className={`h-2 w-2 rounded-full transition-colors ${step === "complete" ? "bg-green-600" : "bg-gray-300"}`} />
        </div>
      </div>
    </div>
  );
}