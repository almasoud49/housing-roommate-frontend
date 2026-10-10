"use client";

import Link from "next/link";
import { useMaintenanceRequests, useMyApplications, useMyBills, useViewings } from "@/hooks";
import { applicationTitle } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/modules/common";

export default function TenantOverview() {
  const apps = useMyApplications({ limit: 5 });
  const maintenance = useMaintenanceRequests({ limit: 1 });
  const viewings = useViewings({ limit: 1 });
  const bills = useMyBills();
  const unpaid = (bills.data?.data ?? []).filter((b) => b.status !== "PAID").length;

  const cards = [
    { label: "Applications", href: "/dashboard/applications", count: apps.data?.meta?.total ?? apps.data?.data.length, loading: apps.isLoading },
    { label: "Maintenance Requests", href: "/dashboard/maintenance", count: maintenance.data?.meta?.total ?? maintenance.data?.data.length, loading: maintenance.isLoading },
    { label: "Viewing Requests", href: "/dashboard/viewings", count: viewings.data?.meta?.total ?? viewings.data?.data.length, loading: viewings.isLoading },
    { label: "Unpaid Utility Bills", href: "/dashboard/utilities", count: unpaid, loading: bills.isLoading },
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">My Activity</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Link href={c.href} key={c.label}>
            <Card>
              <CardContent className="p-6">
                {c.loading ? <Skeleton className="h-8 w-16" /> : <p className="text-3xl font-bold">{c.count ?? 0}</p>}
                <p className="text-sm text-muted-foreground">{c.label}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <h2 className="mb-4 mt-10 text-xl font-semibold">Recent Applications</h2>
      {apps.isLoading ? (
        <Skeleton className="h-32 w-full" />
      ) : !apps.data?.data.length ? (
        <p className="text-muted-foreground">No applications yet. <Link href="/properties" className="text-primary">Browse properties →</Link></p>
      ) : (
        <div className="space-y-3">
          {apps.data.data.slice(0, 5).map((a) => (
            <div key={a.id} className="flex items-center justify-between rounded-lg border p-4">
              <span>{applicationTitle(a)}</span>
              <StatusBadge value={a.status} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
