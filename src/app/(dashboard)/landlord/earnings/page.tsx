"use client";

import { useLandlordDashboard } from "@/hooks";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function EarningsPage() {
  const { data, isLoading } = useLandlordDashboard();
  const stats = data?.data as Record<string, unknown> | undefined;

  if (isLoading) return <Skeleton className="h-64 w-full" />;

  const entries = Object.entries(stats ?? {}).filter(([, v]) => typeof v === "number" || typeof v === "string");

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Earnings & Analytics</h1>
      {entries.length === 0 ? (
        <p className="text-muted-foreground">No earnings data available yet.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-3">
          {entries.map(([k, v]) => (
            <Card key={k}>
              <CardContent className="p-6">
                <p className="text-2xl font-bold">{String(v)}</p>
                <p className="text-sm capitalize text-muted-foreground">{k.replace(/([A-Z])/g, " $1")}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
