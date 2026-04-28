import { usePendingPayments, useVerifyPayment, useRejectPayment } from "@/hooks/usePayments";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/modules/shadcn/ui/card";
import { Button } from "@/modules/shadcn/ui/button";
import { Badge } from "@/modules/shadcn/ui/badge";
import { Alert, AlertDescription } from "@/modules/shadcn/ui/alert";
import { Loader2, CheckCircle2, XCircle, ExternalLink, Clock } from "lucide-react";
import type { PaymentResponse } from "@/types/payment";

const PAYMENT_METHOD_LABELS = {
  TELEBIRR: "TeleBirr",
  CBE_BIRR: "CBE Birr",
};

export const PaymentVerificationDashboard = () => {
  const { data: payments, isLoading, error } = usePendingPayments();
  const verifyMutation = useVerifyPayment();
  const rejectMutation = useRejectPayment();

  const handleVerify = (paymentId: number) => {
    if (confirm("Are you sure you want to verify this payment?")) {
      verifyMutation.mutate(paymentId);
    }
  };

  const handleReject = (paymentId: number) => {
    if (confirm("Are you sure you want to reject this payment?")) {
      rejectMutation.mutate(paymentId);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Failed to load pending payments. Please try again.
        </AlertDescription>
      </Alert>
    );
  }

  if (!payments || payments.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No pending payments to verify</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Pending Payments</h2>
        <Badge variant="secondary">{payments.length} pending</Badge>
      </div>

      <div className="grid gap-4">
        {payments.map((payment: PaymentResponse) => (
          <Card key={payment.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">
                    Payment #{payment.id}
                  </CardTitle>
                  <CardDescription>
                    Appointment #{payment.appointmentId} • {new Date(payment.createdAt).toLocaleString()}
                  </CardDescription>
                </div>
                <Badge>{PAYMENT_METHOD_LABELS[payment.paymentMethod]}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Payment Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Amount</p>
                  <p className="text-lg font-semibold text-primary">{payment.amount} ETB</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Transaction ID</p>
                  <p className="font-mono text-sm">{payment.transactionId}</p>
                </div>
              </div>

              {/* Screenshot Link */}
              {payment.screenshotUrl && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Payment Screenshot</p>
                  <a
                    href={payment.screenshotUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                  >
                    View Screenshot
                    <ExternalLink className="h-4 w-4" />
                  </a>
                  {/* Show image preview */}
                  <div className="mt-2">
                    <img
                      src={payment.screenshotUrl}
                      alt="Payment screenshot"
                      className="max-h-48 rounded-lg border border-slate-200 object-contain"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <Button
                  onClick={() => handleVerify(payment.id)}
                  disabled={verifyMutation.isPending || rejectMutation.isPending}
                  className="flex-1"
                >
                  {verifyMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Verify Payment
                    </>
                  )}
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleReject(payment.id)}
                  disabled={verifyMutation.isPending || rejectMutation.isPending}
                  className="flex-1"
                >
                  {rejectMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Rejecting...
                    </>
                  ) : (
                    <>
                      <XCircle className="mr-2 h-4 w-4" />
                      Reject Payment
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
