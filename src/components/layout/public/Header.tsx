"use client";

import Logo from "@/assets/svg/Logo";
import { Button } from "@/components/ui/button";
import { useGetMe, useLogout } from "@/hooks";
import { toast } from "sonner";
import { UserRole } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { clearAccessToken, setRoleCookie } from "@/utils/auth.utils";

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
  const { data } = useGetMe();
  const { mutate: logout } = useLogout();
  const queryClient = useQueryClient();
  const role = data?.data?.role as UserRole | undefined;

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

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Logo />
          <span>HavenMate</span>
        </Link>
        <nav className="hidden gap-5 md:flex">
          {routes.map((route) => (
            <Link key={route.name} href={route.url} className="text-sm hover:text-primary">
              {route.name}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          {role ? (
            <>
              <Button variant="outline" size="sm" render={<Link href={dashboardRoute[role]} />}>Dashboard</Button>
              <Button size="sm" variant="destructive" onClick={handleLogout}>Logout</Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" render={<Link href="/login" />}>Login</Button>
              <Button size="sm" render={<Link href="/register" />}>Register</Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
