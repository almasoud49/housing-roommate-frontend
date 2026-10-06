import Link from "next/link";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PaymentCancelPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <XCircle className="mx-auto mb-4 size-16 text-destructive" />
      <h1 className="mb-2 text-2xl font-bold">Payment Cancelled</h1>
      <p className="mb-8 text-muted-foreground">Your payment was cancelled. No charges were made.</p>
      <Button render={<Link href="/dashboard/payments" />}>Back to Payments</Button>
    </div>
  );
}
