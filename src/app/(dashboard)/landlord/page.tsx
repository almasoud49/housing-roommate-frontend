"use client";

import Link from "next/link";
import { useCurrentUser, useLandlordDashboard, usePropertyManagerDashboard } from "@/hooks";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/modules/common";
import { formatMoney } from "@/utils/format.util";

interface Row { id: string; tenantName: string; roomName: string; status: string; title?: string; amount?: number; priority?: string; propertyTitle?: string }
interface Dash {
  totalProperties?: number;
  managedProperties?: number;
  totalRooms: number;
  activeRooms: number;
  pendingApplications: number;
  totalApplications: number;
  monthlyRevenue: number;
  totalRevenue: number;
  occupancyRate: number;
  recentApplications: Row[];
  maintenanceRequests?: Row[];
}

export default function LandlordOverview() {
  const { user } = useCurrentUser();
  const isManager = user?.role === "PROPERTY_MANAGER";
  const landlord = useLandlordDashboard(!!user && !isManager);
  const manager = usePropertyManagerDashboard(isManager);
  const query = isManager ? manager : landlord;
  const d = query.data?.data as unknown as Dash | undefined;

  const cards = d
    ? [
        { label: isManager ? "Managed Properties" : "Properties", value: d.managedProperties ?? d.totalProperties ?? 0 },
        { label: "Rooms (active / total)", value: `${d.activeRooms} / ${d.totalRooms}` },
        { label: "Pending Applications", value: d.pendingApplications },
        { label: "Occupancy", value: `${Math.round(d.occupancyRate)}%` },
        { label: "This Month", value: formatMoney(d.monthlyRevenue) },
        { label: "Total Revenue", value: formatMoney(d.totalRevenue) },
      ]
    : [];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{isManager ? "Property Manager Overview" : "Landlord Overview"}</h1>
        {!isManager && <Button render={<Link href="/landlord/properties/new" />}>+ Add Property</Button>}
      </div>
      {query.isLoading ? (
        <Skeleton className="h-32 w-full" />
      ) : query.error || !d ? (
        <p className="text-muted-foreground">Dashboard data is unavailable.</p>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((c) => (
              <Card key={c.label}>
                <CardContent className="p-6">
                  <p className="text-2xl font-bold">{c.value}</p>
                  <p className="text-sm text-muted-foreground">{c.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <h2 className="mb-4 mt-10 text-xl font-semibold">Recent Applications</h2>
          {!d.recentApplications?.length ? (
            <p className="text-muted-foreground">No applications yet.</p>
          ) : (
            <div className="space-y-3">
              {d.recentApplications.slice(0, 5).map((a) => (
                <div key={a.id} className="flex items-center justify-between rounded-lg border p-4">
                  <span>{a.tenantName} — {a.propertyTitle ? `${a.propertyTitle} · ` : ""}{a.roomName}</span>
                  <span className="flex items-center gap-3">
                    <StatusBadge value={a.status} />
                    <Link href="/landlord/applications" className="text-sm text-primary">Review →</Link>
                  </span>
                </div>
              ))}
            </div>
          )}

          {!!d.maintenanceRequests?.length && (
            <>
              <h2 className="mb-4 mt-10 text-xl font-semibold">Open Maintenance</h2>
              <div className="space-y-3">
                {d.maintenanceRequests.slice(0, 5).map((m) => (
                  <div key={m.id} className="flex items-center justify-between rounded-lg border p-4">
                    <span>{m.title} — {m.roomName}</span>
                    <span className="flex items-center gap-2"><StatusBadge value={m.priority} /><StatusBadge value={m.status} /></span>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
