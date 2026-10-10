"use client";

import { Suspense, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, XCircle } from "lucide-react";
import { confirmSslcommerzCallback } from "@/api";

function SuccessContent() {
  const params = useSearchParams();
  const status = params.get("status");
  // SSLCommerz redirects back with ?status=VALID&tran_id=&val_id=&amount=&card_type=&currency=
  const tranId = params.get("tran_id");
  const valId = params.get("val_id");
  const amount = params.get("amount");
  const currency = params.get("currency");
  const cardType = params.get("card_type");

  // The backend is notified by SSLCommerz's server-to-server validation; this
  // fallback covers the case where the browser redirect lands here first.
  const confirmed = useRef(false);
  useEffect(() => {
    if (tranId && !confirmed.current) {
      confirmed.current = true;
      confirmSslcommerzCallback({
        tran_id: tranId,
        status: status ?? "VALID",
        val_id: valId ?? undefined,
      }).catch(() => {});
    }
  }, [tranId, valId, status]);

  const ok = status === "VALID" || status === "success" || !status;

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

      <Card className="mt-8">
        <CardContent className="space-y-2 p-4 text-left text-sm">
          <p className="text-muted-foreground">SSLCommerz (test mode)</p>
          {amount && currency && (
            <p>
              Amount: <span className="font-medium">{amount} {currency}</span>
            </p>
          )}
          {cardType && (
            <p>
              Card type: <span className="font-medium">{cardType}</span>
            </p>
          )}
          {tranId && (
            <p className="break-all">
              Transaction ID: <span className="font-medium">{tranId}</span>
            </p>
          )}
          {valId && (
            <p className="break-all">
              Validation ID: <span className="font-medium">{valId}</span>
            </p>
          )}
          <p className="pt-2 text-muted-foreground">
            View your payment history from the dashboard → Payments.
          </p>
        </CardContent>
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
