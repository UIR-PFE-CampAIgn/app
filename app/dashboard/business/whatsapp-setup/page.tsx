"use client";

import { useSearchParams } from "next/navigation";
import WhatsAppIntegrationMock from "./WhatsAppIntegrationMock"; 

export default function WhatsAppSetupPage() {
  const searchParams = useSearchParams();
  const businessId = searchParams.get('businessId');
  const businessName = searchParams.get('businessName');

  return (
    <WhatsAppIntegrationMock 
      businessId={businessId || undefined}
      businessName={businessName || undefined}
    />
  );
}