"use client";

import { useState } from "react";
import { useMyApplications, useInitiatePayment } from "@/hooks";
import { applicationTitle, type Application } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/apiClient";

export default function PaymentsPage() {
  const { data, isLoading } = useMyApplications();
  const { mutate: pay, isPending } = useInitiatePayment();
  const [payingId, setPayingId] = useState<string | null>(null);
  const applications = data?.data as Application[] | undefined;
  const payable = (applications ?? []).filter((a) => a.status === "ACCEPTED");

  const handlePay = (applicationId: string, amount: number) => {
    setPayingId(applicationId);
    pay(
      { applicationId, amount, currency: "BDT" },
      {
        onSuccess: (res: any) => {
          const url = res?.data?.bkashCreateResponse?.bkashURL;
          if (url) window.location.href = url;
          else toast.success("Payment initiated. Check your bKash app.");
        },
        onError: (err) => toast.error(getErrorMessage(err)),
        onSettled: () => setPayingId(null),
      },
    );
  };

  if (isLoading) return <Skeleton className="h-64 w-full" />;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Payments</h1>
      <h2 className="mb-3 text-lg font-semibold">Pay for Accepted Applications</h2>
      {payable.length === 0 ? (
        <p className="text-muted-foreground">No accepted applications awaiting payment.</p>
      ) : (
        <div className="space-y-3">
          {payable.map((a) => (
            <div key={a.id} className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <p className="font-medium">{applicationTitle(a)}</p>
                <Badge variant="secondary">{a.status}</Badge>
              </div>
              <Button disabled={isPending && payingId === a.id} onClick={() => handlePay(a.id, 1000)}>
                {isPending && payingId === a.id ? "Redirecting..." : "Pay with bKash"}
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
