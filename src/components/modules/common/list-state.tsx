import type { ReactNode } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { getErrorMessage } from "@/lib/apiClient";

/** Standard loading / error / empty handling for list pages. */
export function ListState({
  isLoading,
  error,
  isEmpty,
  emptyText,
  children,
}: {
  isLoading: boolean;
  error?: unknown;
  isEmpty: boolean;
  emptyText: string;
  children: ReactNode;
}) {
  if (isLoading) return <Skeleton className="h-48 w-full" />;
  if (error) return <p className="text-sm text-destructive">{getErrorMessage(error)}</p>;
  if (isEmpty) return <p className="text-muted-foreground">{emptyText}</p>;
  return <>{children}</>;
}
