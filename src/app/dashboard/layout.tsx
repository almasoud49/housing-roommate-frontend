"use client";

import { DashboardShell } from "@/components/dashboard-shell";
import { Bell, CreditCard, Eye, Home, Wrench, Users, UserCircle, LayoutDashboard } from "lucide-react";

const items = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/applications", label: "Applications", icon: Home },
  { href: "/dashboard/payments", label: "Payments", icon: CreditCard },
  { href: "/dashboard/viewings", label: "Viewings", icon: Eye },
  { href: "/dashboard/maintenance", label: "Maintenance", icon: Wrench },
  { href: "/dashboard/roommate", label: "Roommate Match", icon: Users },
  { href: "/dashboard/notifications", label: "Notifications", icon: Bell },
  { href: "/dashboard/profile", label: "Profile", icon: UserCircle },
];

export default function TenantLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell title="Tenant Dashboard" items={items}>{children}</DashboardShell>;
}
