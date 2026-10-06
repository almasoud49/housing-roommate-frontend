import ServicesTabs from "@/components/modules/services-tabs";
import Link from "next/link";
import { Search } from "lucide-react";

export const metadata = { title: "Services" };

export default function ServicesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="mb-2 text-3xl font-bold">Services</h1>
      <p className="mb-10 text-muted-foreground">Everything you need to rent, manage, and live well.</p>

      <ServicesTabs />

      <div className="mt-12 rounded-xl border bg-muted/40 p-8 text-center">
        <h2 className="mb-2 text-xl font-bold">Ready to find your next home?</h2>
        <p className="mb-4 text-muted-foreground">Browse verified listings and apply in minutes.</p>
        <Link href="/properties" className="inline-flex items-center gap-2 text-primary">
          <Search className="size-4" /> Browse properties →
        </Link>
      </div>
    </div>
  );
}
