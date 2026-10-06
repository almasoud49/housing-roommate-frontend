"use client";

import { DashboardShell } from "@/components/dashboard-shell";
import { LayoutDashboard, Users, ScrollText, Settings } from "lucide-react";

const items = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/audit-logs", label: "Audit Logs", icon: ScrollText },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell title="Admin Dashboard" items={items}>{children}</DashboardShell>;
}
