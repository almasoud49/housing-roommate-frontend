"use client";

import Logo from "@/assets/svg/Logo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useGetMe, useLogout } from "@/hooks";
import { toast } from "sonner";
import { UserRole } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Menu, User as UserIcon } from "lucide-react";
import { clearAccessToken, setRoleCookie } from "@/utils/auth.utils";
import { cn } from "cn";

const routes = [
  { name: "Home", url: "/" },
  { name: "Browse", url: "/properties" },
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

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { data } = useGetMe();
  const { mutate: logout } = useLogout();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const user = data?.data;
  const role = user?.role as UserRole | undefined;

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        clearAccessToken();
        setRoleCookie(null);
        queryClient.removeQueries({ queryKey: ["user"] });
        toast.success("Logged out successfully");
        router.push("/login");
        router.refresh();
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
          {role ? (
            <>
              <Button variant="outline" size="sm" render={<Link href={dashboardRoute[role]} />}>
                <UserIcon className="size-4" /> {user?.name ?? "Dashboard"}
              </Button>
              <Button size="sm" variant="destructive" onClick={handleLogout}>Logout</Button>
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
                  <Link href={dashboardRoute[role]} onClick={() => setOpen(false)} className="font-medium text-primary">
                    Dashboard ({user?.name})
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
