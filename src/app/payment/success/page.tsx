"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, XCircle } from "lucide-react";

function SuccessContent() {
  const params = useSearchParams();
  const status = params.get("status");
  const paymentId = params.get("paymentID") ?? params.get("paymentId");
  const ok = status === "success" || !status;

  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      {ok ? (
        <>
          <CheckCircle2 className="mx-auto mb-4 size-16 text-green-500" />
          <h1 className="mb-2 text-2xl font-bold">Payment Successful</h1>
          <p className="text-muted-foreground">Your payment has been processed.</p>
        </>
      ) : (
        <>
          <XCircle className="mx-auto mb-4 size-16 text-destructive" />
          <h1 className="mb-2 text-2xl font-bold">Payment {status}</h1>
          <p className="text-muted-foreground">Please try again or contact support.</p>
        </>
      )}
      {paymentId && <p className="mt-4 text-sm text-muted-foreground">Transaction ID: {paymentId}</p>}
      <Card className="mt-8">
        <CardContent className="p-4 text-sm">View your payment history from the dashboard → Payments.</CardContent>
      </Card>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  );
}
