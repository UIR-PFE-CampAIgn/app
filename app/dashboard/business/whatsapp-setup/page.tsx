"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import WhatsAppIntegrationMock from "./WhatsAppIntegrationMock";

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100/50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-slate-600">Loading campaigns...</p>
      </div>
    </div>
  );
}

function WhatsAppSetupInner() {
  const searchParams = useSearchParams();
  const businessId = searchParams.get("businessId");
  const businessName = searchParams.get("businessName");

  return (
    <WhatsAppIntegrationMock
      businessId={businessId || undefined}
      businessName={businessName || undefined}
    />
  );
}

export default function WhatsAppSetupPage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <WhatsAppSetupInner />
    </Suspense>
  );
}
