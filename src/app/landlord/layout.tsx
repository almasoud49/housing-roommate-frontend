"use client";

import { DashboardShell } from "@/components/dashboard-shell";
import { Building2, FileText, LayoutDashboard, TrendingUp, UserCircle } from "lucide-react";

const items = [
  { href: "/landlord", label: "Overview", icon: LayoutDashboard },
  { href: "/landlord/properties", label: "My Properties", icon: Building2 },
  { href: "/landlord/applications", label: "Applications", icon: FileText },
  { href: "/landlord/earnings", label: "Earnings", icon: TrendingUp },
  { href: "/landlord/profile", label: "Profile", icon: UserCircle },
];

export default function LandlordLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell title="Landlord Dashboard" items={items}>{children}</DashboardShell>;
}
