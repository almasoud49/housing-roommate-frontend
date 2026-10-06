"use client";

import { useMyApplications, useMaintenanceRequests, useViewings } from "@/hooks";
import { applicationTitle, type Application, type MaintenanceRequest, type ViewingRequest } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

export default function TenantOverview() {
  const apps = useMyApplications();
  const maintenance = useMaintenanceRequests();
  const viewings = useViewings();

  const appsData = apps.data?.data as Application[] | undefined;
  const maintenanceData = maintenance.data?.data as MaintenanceRequest[] | undefined;
  const viewingsData = viewings.data?.data as ViewingRequest[] | undefined;

  const cards = [
    { label: "Applications", href: "/dashboard/applications", count: appsData?.length, loading: apps.isLoading },
    { label: "Maintenance Requests", href: "/dashboard/maintenance", count: maintenanceData?.length, loading: maintenance.isLoading },
    { label: "Viewing Requests", href: "/dashboard/viewings", count: viewingsData?.length, loading: viewings.isLoading },
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">My Activity</h1>
      <div className="grid gap-4 sm:grid-cols-3">
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
      ) : !appsData || appsData.length === 0 ? (
        <p className="text-muted-foreground">No applications yet. <Link href="/properties" className="text-primary">Browse properties →</Link></p>
      ) : (
        <div className="space-y-3">
          {appsData.slice(0, 5).map((a) => (
            <div key={a.id} className="flex items-center justify-between rounded-lg border p-4">
              <span>{applicationTitle(a)}</span>
              <span className={`rounded-full px-3 py-1 text-xs ${a.status === "ACCEPTED" ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300" : a.status === "REJECTED" ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300" : "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300"}`}>{a.status}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
