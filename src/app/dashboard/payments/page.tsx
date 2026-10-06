"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { api, getErrorMessage, type ApiSuccess } from "@/lib/api";
import { applicationTitle, type Application } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const amounts: Record<string, number> = {};
function getAmount(id: string) {
  return amounts[id] ?? 1000;
}
function AmountInput({ id }: { id: string }) {
  return (
    <input
      type="number"
      min={1}
      defaultValue={1000}
      className="h-9 w-28 rounded-md border px-2 text-sm"
      onChange={(e) => { amounts[id] = Number(e.target.value); }}
      aria-label="Amount (BDT)"
    />
  );
}

export default function PaymentsPage() {
  const apps = useQuery({
    queryKey: ["my-applications"],
    queryFn: async () => (await api.get<ApiSuccess<Application[]>>("/applications/my-applications")).data.data,
  });
  const [paying, setPaying] = useState<string | null>(null);

  const pay = async (applicationId: string, amount: number) => {
    setPaying(applicationId);
    try {
      const res = await api.post("/payment/initiate", { applicationId, amount, currency: "BDT" });
      const data = res.data?.data;
      const url = data?.bkashCreateResponse?.bkashURL ?? data?.bkashCreateResponse?.callbackURL;
      if (url) {
        window.location.href = url;
      } else {
        toast.success("Payment initiated. Check your bKash app.");
      }
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setPaying(null);
    }
  };

  if (apps.isLoading) return <Skeleton className="h-64 w-full" />;

  const payable = (apps.data ?? []).filter((a) => a.status === "ACCEPTED");

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
              <div className="flex items-center gap-2">
                <AmountInput id={a.id} />
                <Button disabled={paying === a.id} onClick={() => pay(a.id, getAmount(a.id))}>
                  {paying === a.id ? "Redirecting..." : "Pay with bKash"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
