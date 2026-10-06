"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import { cn } from "cn";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export function DashboardShell({ title, items, children }: { title: string; items: NavItem[]; children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 md:flex-row">
      <aside className="md:w-56 shrink-0">
        <h2 className="mb-4 text-lg font-bold">{title}</h2>
        <nav className="flex flex-row gap-2 overflow-x-auto md:flex-col">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 rounded-md px-3 py-2 text-sm whitespace-nowrap hover:bg-muted",
                pathname === item.href && "bg-primary/10 text-primary font-medium",
              )}
            >
              <item.icon className="size-4" />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
