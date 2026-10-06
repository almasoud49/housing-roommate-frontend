import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { serverFetch } from "@/utils/server-fetch.util";
import type { Property } from "@/types";
import { Shield, Users, Wrench, CreditCard, Search, CheckCircle2, Building2, Star, FileText, Receipt, CalendarCheck, LayoutDashboard } from "lucide-react";

export const metadata = {
  title: "HavenMate — Find Rooms & Roommates",
};

export default async function HomePage() {
  const properties = await serverFetch<Property[]>("/properties?limit=6");
  const featured = properties?.slice(0, 3) ?? [];

  return (
    <div>
      <section className="bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-emerald-950 dark:to-teal-950">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-20">
          <h1 className="max-w-2xl text-4xl font-bold tracking-tight md:text-5xl">
            Find a safe home and the perfect roommate.
          </h1>
          <p className="max-w-xl text-muted-foreground">
            HavenMate connects verified tenants, landlords, and property managers.
            Browse verified listings, apply in one click, and manage rent, utilities and
            maintenance — all in one place.
          </p>
          <form action="/properties" className="flex w-full max-w-xl gap-2">
            <input
              name="search"
              placeholder="Search by city, title, or address..."
              className="h-11 flex-1 rounded-md border bg-background px-4 text-sm"
            />
            <Button size="lg" type="submit">
              <Search className="size-4" /> Search
            </Button>
          </form>
          <div className="flex gap-3">
            <Button variant="outline" size="lg" render={<Link href="/register" />}>Join Free</Button>
            <Button variant="ghost" size="lg" render={<Link href="/about" />}>Learn More</Button>
          </div>
        </div>
      </section>

      <section className="border-b bg-muted/30">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-8 text-center sm:grid-cols-4">
          {[
            { icon: Building2, value: `${properties?.length ?? 0}+`, label: "Active Listings" },
            { icon: Users, value: "1.2k+", label: "Happy Tenants" },
            { icon: Shield, value: "100%", label: "Verified Properties" },
            { icon: Star, value: "4.8/5", label: "User Rating" },
          ].map((s) => (
            <div key={s.label} className="flex flex-col items-center gap-1">
              <s.icon className="size-6 text-primary" />
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="mb-8 text-2xl font-bold">Why HavenMate</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Shield, title: "Verified Listings", desc: "Every property and landlord is verified before going live." },
            { icon: Users, title: "Roommate Matching", desc: "Smart preference matching for compatible housemates." },
            { icon: CreditCard, title: "Secure Payments", desc: "Pay rent & deposits safely via bKash." },
            { icon: Wrench, title: "Maintenance", desc: "Raise and track repair requests with ease." },
          ].map((f) => (
            <Card key={f.title}>
              <CardContent className="flex flex-col gap-3 p-6">
                <f.icon className="size-8 text-primary" />
                <h3 className="font-semibold">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="mb-2 text-2xl font-bold">Everything You Need</h2>
        <p className="mb-8 text-muted-foreground">A complete toolkit for tenants, landlords, and property managers.</p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Shield, title: "Verified Listings", desc: "Every property and landlord is verified before going live." },
            { icon: Users, title: "Roommate Matching", desc: "Smart preference matching for compatible housemates." },
            { icon: FileText, title: "Application Tracking", desc: "Apply in one click and follow your application status in real time." },
            { icon: CreditCard, title: "Secure bKash Payments", desc: "Pay deposits and rent online with full receipts." },
            { icon: Receipt, title: "Utility Bill Splitting", desc: "Fairly split shared electricity, water, and internet bills." },
            { icon: Wrench, title: "Maintenance Requests", desc: "Raise repair tickets and track progress to resolution." },
            { icon: CalendarCheck, title: "Viewing Schedules", desc: "Book property viewings and get reminders." },
            { icon: LayoutDashboard, title: "Role-Based Dashboards", desc: "Tailored experiences for tenants, landlords, and admins." },
          ].map((f) => (
            <Card key={f.title}>
              <CardContent className="flex flex-col gap-3 p-6">
                <f.icon className="size-8 text-primary" />
                <h3 className="font-semibold">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-muted/30 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="mb-8 text-2xl font-bold">How It Works</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              "Create your free account",
              "Browse verified listings",
              "Apply or post your property",
              "Move in & manage everything",
            ].map((step, i) => (
              <div key={step} className="flex items-start gap-3">
                <CheckCircle2 className="mt-1 size-5 shrink-0 text-primary" />
                <p className="font-medium">
                  <span className="text-muted-foreground">Step {i + 1}:</span> {step}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="mb-8 text-2xl font-bold">Built for Every Role</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { role: "Tenants", desc: "Find rooms, apply, pay rent, split bills, and raise maintenance requests.", href: "/dashboard" },
            { role: "Landlords", desc: "List properties, review applications, track earnings, and manage tenants.", href: "/landlord" },
            { role: "Admins", desc: "Monitor platform analytics, manage users, and review audit logs.", href: "/admin" },
          ].map((r) => (
            <Link href={r.href} key={r.role}>
              <Card className="h-full transition hover:shadow-md">
                <CardContent className="p-6">
                  <h3 className="mb-2 font-semibold">{r.role}</h3>
                  <p className="text-sm text-muted-foreground">{r.desc}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Featured Homes</h2>
          <Link href="/properties" className="text-sm text-primary">View all →</Link>
        </div>
        {featured.length === 0 ? (
          <p className="text-muted-foreground">No listings available right now.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {featured.map((p) => (
              <Link href={`/properties/${p.id}`} key={p.id}>
                <Card className="h-full transition hover:shadow-md">
                  <CardContent className="flex h-full flex-col gap-2 p-5">
                    <h3 className="font-semibold">{p.title}</h3>
                    <p className="text-sm text-muted-foreground">{p.address}, {p.city}</p>
                    <p className="mt-auto text-sm line-clamp-2">{p.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="bg-gradient-to-r from-emerald-600 to-teal-600 py-16 text-white">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold">Ready to find your place?</h2>
          <p className="mb-6 opacity-90">Join thousands of verified renters and property owners today.</p>
          <Button size="lg" variant="secondary" render={<Link href="/register" />}>Get Started Free</Button>
        </div>
      </section>
    </div>
  );
}
