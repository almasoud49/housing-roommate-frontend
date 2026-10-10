"use client";

import Link from "next/link";
import { Bell } from "lucide-react";
import { useCurrentUser, useNotificationStream, useUnreadCount } from "@/hooks";
import { Button } from "@/components/ui/button";
import type { UserRole } from "@/types";

const base: Record<UserRole, string> = {
  TENANT: "/dashboard",
  LANDLORD: "/landlord",
  PROPERTY_MANAGER: "/landlord",
  ADMIN: "/admin",
};

/** Header bell with live unread count (SSE-driven). */
export function NotificationBell({ role }: { role: UserRole }) {
  const { user } = useCurrentUser();
  useNotificationStream(!!user);
  const { data } = useUnreadCount();
  const count = data?.data?.unreadCount ?? 0;

  return (
    <Button variant="ghost" size="icon" className="relative ml-auto" render={<Link href={`${base[role]}/notifications`} aria-label="Notifications" />}>
      <Bell />
      {count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Button>
  );
}
