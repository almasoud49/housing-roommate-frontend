"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Menu, Home, X, User as UserIcon } from "lucide-react";
import { useAuth } from "@/store/auth";
import { api, getErrorMessage } from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  const { user, clearAuth } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const dashboardHref =
    user?.role === "ADMIN" ? "/admin" : user?.role === "LANDLORD" ? "/landlord" : "/dashboard";

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      clearAuth();
      router.push("/login");
      router.refresh();
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <Home className="size-5 text-primary" />
          HavenMate
        </Link>

        <nav className="hidden items-center gap-6 text-sm md:flex">
          <Link href="/properties" className="hover:text-primary">Browse</Link>
          <Link href="/about" className="hover:text-primary">About</Link>
          <Link href="/services" className="hover:text-primary">Services</Link>
          <Link href="/pricing" className="hover:text-primary">Pricing</Link>
          <Link href="/contact" className="hover:text-primary">Contact</Link>
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {user ? (
            <>
              <Button variant="outline" size="sm" onClick={() => router.push(dashboardHref)}>
                <UserIcon className="size-4" /> {user.name}
              </Button>
              <Button size="sm" variant="destructive" onClick={logout}>Logout</Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => router.push("/login")}>Login</Button>
              <Button size="sm" onClick={() => router.push("/register")}>Register</Button>
            </>
          )}
        </div>

        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="flex flex-col gap-3 border-t px-4 py-4 text-sm md:hidden">
          <Link href="/properties" onClick={() => setOpen(false)}>Browse</Link>
          <Link href="/about" onClick={() => setOpen(false)}>About</Link>
          <Link href="/services" onClick={() => setOpen(false)}>Services</Link>
          <Link href="/pricing" onClick={() => setOpen(false)}>Pricing</Link>
          <Link href="/contact" onClick={() => setOpen(false)}>Contact</Link>
          {user ? (
            <>
              <Link href={dashboardHref} onClick={() => setOpen(false)}>Dashboard</Link>
              <button className="text-left text-destructive" onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <Link href="/login" onClick={() => setOpen(false)}>Login</Link>
              <Link href="/register" onClick={() => setOpen(false)}>Register</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t bg-muted/40">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} HavenMate — Find your next roommate, safely.</p>
        <div className="flex gap-4">
          <Link href="/about" className="hover:text-primary">About</Link>
          <Link href="/contact" className="hover:text-primary">Contact</Link>
          <Link href="/pricing" className="hover:text-primary">Pricing</Link>
        </div>
      </div>
    </footer>
  );
}
