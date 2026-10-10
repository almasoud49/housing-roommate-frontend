"use client";

import Logo from "@/assets/svg/Logo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useGetMe, useLogout, useNotificationStream, useUnreadCount } from "@/hooks";
import { toast } from "sonner";
import { UserRole } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  BadgeCheck,
  Bell,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ThemeToggle from "@/components/layout/public/ThemeToggle";
import { clearAccessToken, setRoleCookie } from "@/utils/auth.utils";
import { cn } from "cn";

const routes = [
  { name: "Home", url: "/" },
  { name: "About", url: "/about" },
  { name: "Services", url: "/services" },
  { name: "Pricing", url: "/pricing" },
  { name: "Contact", url: "/contact" },
];

const dashboardRoute: Record<UserRole, string> = {
  ADMIN: "/admin",
  LANDLORD: "/landlord",
  PROPERTY_MANAGER: "/landlord",
  TENANT: "/dashboard",
};

const profileRoute: Record<UserRole, string> = {
  ADMIN: "/admin/settings",
  LANDLORD: "/landlord/profile",
  PROPERTY_MANAGER: "/landlord/profile",
  TENANT: "/dashboard/profile",
};

const notificationsRoute: Record<UserRole, string> = {
  ADMIN: "/admin/notifications",
  LANDLORD: "/landlord/notifications",
  PROPERTY_MANAGER: "/landlord/notifications",
  TENANT: "/dashboard/notifications",
};

const roleLabel: Record<UserRole, string> = {
  ADMIN: "Admin",
  LANDLORD: "Landlord",
  PROPERTY_MANAGER: "Property Manager",
  TENANT: "Tenant",
};

export default function Header() {
  const pathname = usePathname();
  const { data } = useGetMe();
  const { mutate: logout } = useLogout();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const user = data?.data;
  const role = user?.role as UserRole | undefined;
  const base = role ? dashboardRoute[role] : undefined;

  // keep the small bell count in sync when logged in
  useNotificationStream(!!user);
  const { data: unread } = useUnreadCount();
  const unreadCount = role ? (unread?.data?.unreadCount ?? 0) : 0;
  const initial = user?.name?.trim()?.charAt(0).toUpperCase() ?? "U";

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        clearAccessToken();
        setRoleCookie(null);
        queryClient.removeQueries({ queryKey: ["user"] });
        toast.success("Logged out successfully");
        // Full reload is deliberate: it wipes the client router cache (stale /dashboard
        // RSC prefetches can otherwise turn into middleware redirects to /login).
        // eslint-disable-next-line @next/next/no-location-assign-relative-destination
        window.location.assign("/");
      },
      onError: () => toast.error("Logout failed"),
    });
  };

  const isActive = (url: string) =>
    url === "/" ? pathname === "/" : pathname.startsWith(url);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Logo />
          <span>HavenMate</span>
        </Link>

        <nav className="hidden gap-5 md:flex">
          {routes.map((route) => (
            <Link
              key={route.name}
              href={route.url}
              className={cn(
                "text-sm transition hover:text-primary",
                isActive(route.url) && "font-medium text-primary",
              )}
            >
              {route.name}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          {role ? (
            <>
              {base && (
                <Link
                  href={notificationsRoute[role]}
                  aria-label="Notifications"
                  className="relative inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition hover:bg-accent hover:text-foreground"
                >
                  <Bell className="size-4.5" />
                  {unreadCount > 0 && (
                    <span className="absolute right-1.5 top-1.5 flex min-w-4 -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold leading-4 text-primary-foreground">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </Link>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger
                  aria-label={`Account menu for ${user?.name ?? "user"}`}
                  className="flex items-center gap-2.5 rounded-full border bg-background py-1 pl-1 pr-2.5 outline-none transition hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Avatar size="sm">
                    <AvatarImage src={user?.profile?.avatarUrl ?? undefined} alt={user?.name ?? ""} />
                    <AvatarFallback>{initial}</AvatarFallback>
                  </Avatar>
                  <span className="flex flex-col items-start leading-tight">
                    <span className="max-w-28 truncate text-sm font-medium">{user?.name ?? "Account"}</span>
                    <span className="max-w-28 truncate text-xs text-muted-foreground">
                      {roleLabel[role]}
                    </span>
                  </span>
                  <ChevronDown className="size-3.5 text-muted-foreground" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" sideOffset={8} className="min-w-64">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="py-3">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={user?.profile?.avatarUrl ?? undefined} alt={user?.name ?? ""} />
                          <AvatarFallback>{initial}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1 space-y-1">
                          <div className="flex items-center gap-1.5">
                            <p className="truncate text-sm font-semibold leading-none">
                              {user?.name ?? "Account"}
                            </p>
                            {user?.isVerified && (
                              <BadgeCheck className="size-4 shrink-0 text-green-600" aria-label="Verified" />
                            )}
                          </div>
                          <p className="truncate text-xs font-normal text-muted-foreground">{user?.email}</p>
                          <Badge variant="secondary" className="w-fit">
                            {roleLabel[role]}
                          </Badge>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem render={<Link href={dashboardRoute[role]} />}>
                    <LayoutDashboard /> Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem render={<Link href={profileRoute[role]} />}>
                    <Settings /> {role === "ADMIN" ? "Settings" : "Profile & settings"}
                  </DropdownMenuItem>
                  <DropdownMenuItem render={<Link href={notificationsRoute[role]} />}>
                    <Bell /> Notifications
                    {unreadCount > 0 && (
                      <Badge className="ml-auto">{unreadCount > 99 ? "99+" : unreadCount}</Badge>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem variant="destructive" onClick={handleLogout}>
                    <LogOut /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" render={<Link href="/login" />}>Login</Button>
              <Button size="sm" render={<Link href="/register" />}>Register</Button>
            </>
          )}
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger className="md:hidden" aria-label="Open menu">
            <Menu className="size-6" />
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <nav className="mt-8 flex flex-col gap-4">
              {routes.map((route) => (
                <Link
                  key={route.name}
                  href={route.url}
                  onClick={() => setOpen(false)}
                  className={cn("text-base", isActive(route.url) && "font-medium text-primary")}
                >
                  {route.name}
                </Link>
              ))}
              <div className="my-2 h-px bg-border" />
              {role ? (
                <>
                  <div className="flex items-center gap-3">
                    <Avatar size="lg">
                      <AvatarImage src={user?.profile?.avatarUrl ?? undefined} alt={user?.name ?? ""} />
                      <AvatarFallback>{initial}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="truncate font-medium">{user?.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
                      <Badge variant="secondary" className="mt-1 w-fit">
                        {roleLabel[role]}
                      </Badge>
                    </div>
                  </div>
                  <Link href={dashboardRoute[role]} onClick={() => setOpen(false)} className="font-medium text-primary">
                    Dashboard
                  </Link>
                  <Link href={profileRoute[role]} onClick={() => setOpen(false)}>Profile &amp; settings</Link>
                  <Link href={notificationsRoute[role]} onClick={() => setOpen(false)}>
                    Notifications{unreadCount > 0 ? ` (${unreadCount})` : ""}
                  </Link>
                  <button className="text-left text-destructive" onClick={handleLogout}>Logout</button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setOpen(false)}>Login</Link>
                  <Link href="/register" onClick={() => setOpen(false)}>Register</Link>
                </>
              )}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
