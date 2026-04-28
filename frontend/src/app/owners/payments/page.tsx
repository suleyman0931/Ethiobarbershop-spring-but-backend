"use client";

import { PaymentVerificationDashboard } from "@/components/payments/PaymentVerificationDashboard";

export default function OwnerPaymentsPage() {
  return (
    <div className="container max-w-6xl mx-auto py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Payment Verification</h1>
          <p className="text-muted-foreground mt-2">
            Review and verify pending customer payments
          </p>
        </div>
        <PaymentVerificationDashboard />
      </div>
    </div>
  );
}
