import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { serverFetch } from "@/lib/server-fetch";
import type { Property } from "@/lib/types";
import { Shield, Users, Wrench, CreditCard } from "lucide-react";

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
          <div className="flex gap-3">
            <Button size="lg" render={<Link href="/properties" />}>Browse Listings</Button>
            <Button variant="outline" size="lg" render={<Link href="/register" />}>Join Free</Button>
          </div>
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
    </div>
  );
}
