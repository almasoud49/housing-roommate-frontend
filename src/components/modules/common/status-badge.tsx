import { cn } from "cn";
import { humanize } from "@/utils/format.util";

const GOOD = ["ACCEPTED", "CONFIRMED", "COMPLETED", "PAID", "SIGNED", "RESOLVED", "CLOSED", "CONNECTED", "ACTIVE", "APPROVED"];
const BAD = ["REJECTED", "CANCELLED", "FAILED", "OVERDUE", "BLOCKED", "REVOKED", "EXPIRED", "NO_SHOW", "URGENT", "REFUNDED"];
const WARN = ["PENDING", "OPEN", "PARTIAL", "PENDING_SIGNATURE", "WAITING_PARTS", "WAITING_VENDOR", "IN_PROGRESS", "INTERESTED", "HIGH", "DRAFT", "MEDIUM"];

export function StatusBadge({ value, className }: { value?: string | null; className?: string }) {
  if (!value) return null;
  const tone = GOOD.includes(value)
    ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300"
    : BAD.includes(value)
      ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
      : WARN.includes(value)
        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300"
        : "bg-muted text-muted-foreground";
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", tone, className)}>
      {humanize(value)}
    </span>
  );
}
