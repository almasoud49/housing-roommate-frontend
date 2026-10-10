"use client";

import { useAdminStats } from "@/hooks";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444"];

export default function AdminOverviewPage() {
  const { data, isLoading } = useAdminStats();
  const stats = data?.data;

  if (isLoading) return <Skeleton className="h-96 w-full" />;
  if (!stats) return <p className="text-muted-foreground">Failed to load stats.</p>;

  const roleData = [
    { name: "Tenants", value: stats.totalTenants },
    { name: "Landlords", value: stats.totalLandlords },
    { name: "Property managers", value: Math.max(stats.totalUsers - stats.totalTenants - stats.totalLandlords - stats.totalAdmins, 0) },
    { name: "Admins", value: stats.totalAdmins },
  ];
  const barData = [
    { name: "Properties", value: stats.totalProperties },
    { name: "Rooms", value: stats.totalRooms },
    { name: "Applications", value: stats.totalApplications },
    { name: "Payments", value: stats.totalPayments },
    { name: "Reviews", value: stats.totalReviews },
  ];
  const statCards = [
    { label: "Total Users", value: stats.totalUsers },
    { label: "Properties", value: stats.totalProperties },
    { label: "Applications", value: stats.totalApplications },
    { label: "Pending Applications", value: stats.pendingApplications },
    { label: "Payments Completed", value: stats.completedPayments },
    { label: "Total Reviews", value: stats.totalReviews },
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Platform Analytics</h1>
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        {statCards.map((s) => (
          <Card key={s.label}>
            <CardContent className="p-6">
              <p className="text-3xl font-bold">{s.value}</p>
              <p className="text-sm text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <h2 className="mb-4 font-semibold">Platform Resources</h2>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={barData}>
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
            <h2 className="mb-4 font-semibold">Users by Role</h2>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={roleData} dataKey="value" nameKey="name" outerRadius={80} label>
                  {roleData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
