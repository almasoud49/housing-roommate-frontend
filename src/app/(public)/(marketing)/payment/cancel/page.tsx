"use client";

import { Suspense, useEffect, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { confirmSslcommerzCallback } from "@/api";

function CancelContent() {
  const params = useSearchParams();
  const status = params.get("status");
  const tranId = params.get("tran_id");
  const valId = params.get("val_id");
  const isSslcommerz = !!(tranId || valId);

  // Let the backend record the failed/cancelled session; SSLCommerz normally
  // hits the callback itself, this covers a redirect that lands here first.
  const confirmed = useRef(false);
  useEffect(() => {
    if (isSslcommerz && tranId && !confirmed.current) {
      confirmed.current = true;
      confirmSslcommerzCallback({
        tran_id: tranId,
        status: status ?? "CANCELLED",
        val_id: valId ?? undefined,
      }).catch(() => {});
    }
  }, [isSslcommerz, tranId, valId, status]);

  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <XCircle className="mx-auto mb-4 size-16 text-destructive" />
      <h1 className="mb-2 text-2xl font-bold">
        {isSslcommerz && (status === "FAILED" || status === "CANCELLED") ? `Payment ${status}` : "Payment Cancelled"}
      </h1>
      <p className="mb-2 text-muted-foreground">
        {isSslcommerz
          ? "Your SSLCommerz (test mode) payment was not completed. No charges were made."
          : "Your payment was cancelled. No charges were made."}
      </p>
      {isSslcommerz && tranId && (
        <p className="mb-8 break-all text-sm text-muted-foreground">
          Transaction ID: {tranId}
          {valId ? ` · Validation ID: ${valId}` : ""}
        </p>
      )}
      {!isSslcommerz && <div className="mb-8" />}
      <Button render={<Link href="/dashboard/payments" />}>Back to Payments</Button>
    </div>
  );
}

export default function PaymentCancelPage() {
  return (
    <Suspense>
      <CancelContent />
    </Suspense>
  );
}
