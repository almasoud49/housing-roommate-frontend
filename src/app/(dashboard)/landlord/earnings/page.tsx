"use client";

import { useCurrentUser, useLandlordDashboard, usePropertyManagerDashboard } from "@/hooks";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader, StatusBadge } from "@/components/modules/common";
import { formatDate, formatMoney } from "@/utils/format.util";
import { Bar, BarChart, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface Dash {
  totalRooms: number;
  activeRooms: number;
  totalApplications: number;
  pendingApplications: number;
  acceptedApplications?: number;
  totalRevenue: number;
  monthlyRevenue: number;
  occupancyRate: number;
  upcomingRents: { id: string; tenantName: string; roomName: string; amount: number; dueDate: string; status: string }[];
}

export default function EarningsPage() {
  const { user } = useCurrentUser();
  const isManager = user?.role === "PROPERTY_MANAGER";
  const landlord = useLandlordDashboard(!!user && !isManager);
  const manager = usePropertyManagerDashboard(isManager);
  const query = isManager ? manager : landlord;
  const d = query.data?.data as unknown as Dash | undefined;

  if (query.isLoading) return <Skeleton className="h-64 w-full" />;
  if (!d) return <p className="text-muted-foreground">No earnings data available yet.</p>;

  const accepted = d.acceptedApplications ?? Math.max(d.totalApplications - d.pendingApplications, 0);
  const roomData = [
    { name: "Active", value: d.activeRooms },
    { name: "Inactive", value: Math.max(d.totalRooms - d.activeRooms, 0) },
  ];
  const appData = [
    { name: "Pending", value: d.pendingApplications },
    { name: "Accepted", value: accepted },
    { name: "Other", value: Math.max(d.totalApplications - d.pendingApplications - accepted, 0) },
  ];
  const stats = [
    { label: "Total Revenue", value: formatMoney(d.totalRevenue) },
    { label: "This Month", value: formatMoney(d.monthlyRevenue) },
    { label: "Occupancy Rate", value: `${Math.round(d.occupancyRate)}%` },
    { label: "Applications", value: d.totalApplications },
  ];

  return (
    <div>
      <PageHeader title="Earnings & Analytics" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="p-6">
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-sm text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <h2 className="mb-4 font-semibold">Applications</h2>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={appData}>
                <XAxis dataKey="name" fontSize={12} />
                <YAxis allowDecimals={false} fontSize={12} />
                <Tooltip />
                <Bar dataKey="value" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h2 className="mb-4 font-semibold">Room availability</h2>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={roomData} dataKey="value" nameKey="name" outerRadius={80} label>
                  {roomData.map((_, i) => <Cell key={i} fill={["#10b981", "#94a3b8"][i]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <h2 className="mb-3 mt-8 text-lg font-semibold">Upcoming Rents</h2>
      {!d.upcomingRents?.length ? (
        <p className="text-muted-foreground">No upcoming rents.</p>
      ) : (
        <div className="space-y-3">
          {d.upcomingRents.map((r) => (
            <div key={r.id} className="flex items-center justify-between rounded-lg border p-4 text-sm">
              <span>{r.tenantName} — {r.roomName}</span>
              <span className="flex items-center gap-3">{formatMoney(r.amount)} · due {formatDate(r.dueDate)} <StatusBadge value={r.status} /></span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
