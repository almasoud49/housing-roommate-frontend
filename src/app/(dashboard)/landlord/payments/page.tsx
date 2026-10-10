"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useRefundPayment, useSslcommerzStatus } from "@/hooks";
import { getErrorMessage } from "@/lib/apiClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { FormField, PageHeader, StatusBadge } from "@/components/modules/common";
import { formatMoney } from "@/utils/format.util";

export default function LandlordPaymentsPage() {
  const [lookupInput, setLookupInput] = useState("");
  const [lookupId, setLookupId] = useState("");
  const status = useSslcommerzStatus(lookupId, !!lookupId);
  const payment = status.data?.data as
    | { status?: string; amount?: number; currency?: string; card_type?: string }
    | undefined;

  const refund = useRefundPayment();
  const [form, setForm] = useState({ amount: "", reason: "", tranId: "" });

  const submit = () =>
    refund.mutate(
      {
        paymentId: lookupId,
        amount: Number(form.amount),
        reason: form.reason,
        tranId: form.tranId || undefined,
      },
      {
        onSuccess: () => {
          toast.success("Payment refunded");
          setForm({ amount: "", reason: "", tranId: "" });
          status.refetch();
        },
        onError: (e) => toast.error(getErrorMessage(e)),
      },
    );

  return (
    <div className="max-w-xl">
      <PageHeader
        title="Payments & Refunds"
        description="Look up a tenant's SSLCommerz (test mode) payment by its val_id and refund it if needed."
      />
      <Card className="mb-6">
        <CardContent className="space-y-3 p-6">
          <FormField label="SSLCommerz val_id">
            <div className="flex gap-2">
              <Input
                value={lookupInput}
                onChange={(e) => setLookupInput(e.target.value)}
                placeholder="e.g. 2409101543..."
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    if (lookupInput.trim() && lookupInput.trim() !== lookupId) setLookupId(lookupInput.trim());
                    else if (lookupInput.trim() === lookupId) status.refetch();
                  }
                }}
              />
              <Button
                disabled={!lookupInput.trim()}
                onClick={() =>
                  lookupInput.trim() === lookupId ? status.refetch() : setLookupId(lookupInput.trim())
                }
              >
                {status.isFetching ? "Checking..." : "Look up"}
              </Button>
            </div>
          </FormField>
          {status.error && <p className="text-sm text-destructive">{getErrorMessage(status.error)}</p>}
          {payment && (
            <div className="flex flex-col gap-1 rounded-md border p-3 text-sm sm:flex-row sm:items-center sm:justify-between">
              <span>
                {formatMoney(payment.amount, payment.currency)}
                {payment.card_type && <span className="ml-2 text-muted-foreground">{payment.card_type}</span>}
              </span>
              <StatusBadge value={payment.status} />
            </div>
          )}
        </CardContent>
      </Card>

      {payment?.status === "COMPLETED" && (
        <Card>
          <CardContent className="space-y-3 p-6">
            <h2 className="font-semibold">Refund this payment</h2>
            <FormField label="Amount (BDT)">
              <Input
                type="number"
                min={1}
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
              />
            </FormField>
            <FormField label="Reason">
              <Input
                maxLength={255}
                value={form.reason}
                onChange={(e) => setForm({ ...form, reason: e.target.value })}
              />
            </FormField>
            <FormField
              label="SSLCommerz tran_id (optional)"
              hint="Defaults to the transaction recorded when the payment was executed."
            >
              <Input value={form.tranId} onChange={(e) => setForm({ ...form, tranId: e.target.value })} />
            </FormField>
            <Button
              variant="destructive"
              disabled={refund.isPending || !Number(form.amount) || !form.reason.trim()}
              onClick={submit}
            >
              {refund.isPending ? "Refunding..." : "Refund"}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
