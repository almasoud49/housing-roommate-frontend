"use client";

import { useQuery } from "@tanstack/react-query";
import { api, type ApiSuccess } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function EarningsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["landlord-dashboard"],
    queryFn: async () => (await api.get<ApiSuccess<Record<string, unknown>>>("/admin/dashboard/landlord")).data.data,
  });

  if (isLoading) return <Skeleton className="h-64 w-full" />;

  const entries = Object.entries(data ?? {}).filter(([, v]) => typeof v === "number" || typeof v === "string");

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
