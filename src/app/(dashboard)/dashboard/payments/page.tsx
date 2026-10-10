"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useInitiatePayment, useMyApplications, usePaymentStatus, useSslcommerzStatus } from "@/hooks";
import { getErrorMessage } from "@/lib/apiClient";
import { applicationTitle, roomLabel, type Application, type Payment } from "@/types";
import { Button } from "@/components/ui/button";
import { ListState, PageHeader, StatusBadge } from "@/components/modules/common";
import { formatDate, formatMoney } from "@/utils/format.util";

function PaymentRow({ application }: { application: Application }) {
  const { data, isLoading } = usePaymentStatus(application.id);
  const payment: Payment | null | undefined = data?.data;
  const { mutate: pay, isPending } = useInitiatePayment();
  const [checked, setChecked] = useState(false);
  const { data: sslStatus, isFetching: isFetchingSsl, refetch: refetchSsl } = useSslcommerzStatus(payment?.sslCommerzValId ?? "", checked);
  const amount = application.room?.price ?? payment?.amount ?? 0;

  const handlePay = () =>
    pay(
      { applicationId: application.id, amount, currency: "BDT" },
      {
        onSuccess: (res) => {
          const url = res?.data?.sslCommerzCreateResponse?.GatewayPageURL;
          if (url) {
            window.location.href = url;
            // After redirect completes, refresh payment status
            setChecked(true);
          } else {
            toast.success(res?.data?.status === "COMPLETED" ? "This application is already paid." : "Payment initiated with SSLCommerz.");
          }
        },
        onError: (err) => toast.error(getErrorMessage(err)),
      },
    );

  const completed = payment?.status === "COMPLETED" || payment?.status === "REFUNDED";

  // Refresh SSLCommerz status after redirect from payment success page
  useEffect(() => {
    if (checked && payment?.sslCommerzValId) {
      refetchSsl();
      setChecked(false);
    }
  }, [checked, payment?.sslCommerzValId]);

  return (
    <div className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-medium">{applicationTitle(application)}</p>
        <p className="text-sm text-muted-foreground">
          {roomLabel(application.room)} · {formatMoney(payment?.amount ?? amount)}
          {payment && ` · ${formatDate(payment.createdAt)}`}
        </p>
        {checked && typeof sslStatus?.data === "string" && (
          <p className="mt-1 text-xs text-muted-foreground">SSLCommerz status refreshed.</p>
        )}
      </div>
      <div className="flex items-center gap-2">
        {isLoading ? null : <StatusBadge value={payment?.status ?? "PENDING"} />}
        {!completed && payment?.sslCommerzValId && (
          <Button size="sm" variant="outline" disabled={isFetchingSsl} onClick={() => setChecked(true)}>
            {isFetchingSsl ? "Checking..." : "Check status"}
          </Button>
        )}
        {!completed && (
          <Button size="sm" disabled={isPending || !amount} onClick={handlePay}>
            {isPending ? "Redirecting..." : payment ? "Continue payment" : "Pay with SSLCommerz"}
          </Button>
        )}
      </div>
    </div>
  );
}

export default function PaymentsPage() {
  const { data, isLoading, error } = useMyApplications({ status: "ACCEPTED", limit: 50 });
  const payable = data?.data ?? [];

  return (
    <div>
      <PageHeader
        title="Payments"
        description="Pay for your accepted applications via SSLCommerz — test mode, no real charges."
      />
      <ListState isLoading={isLoading} error={error} isEmpty={!payable.length} emptyText="No accepted applications awaiting payment.">
        <div className="space-y-3">
          {payable.map((a) => (
            <PaymentRow key={a.id} application={a} />
          ))}
        </div>
      </ListState>
    </div>
  );
}
