import Link from "next/link";
import { Search, ArrowRight } from "lucide-react";

export const metadata = { title: "Services" };

const services = [
  { title: "Verified Property Listings", desc: "Browse apartments, houses and rooms verified by our team.", href: "/properties", category: "Browse" },
  { title: "Roommate Matching", desc: "Set lifestyle preferences and get matched with compatible roommates.", href: "/dashboard/roommate", category: "Tenants" },
  { title: "Application Workflow", desc: "Apply to a property in minutes and track your application status.", href: "/dashboard/applications", category: "Tenants" },
  { title: "Secure Rent Payments", desc: "Pay deposits and rent online via SSLCommerz with full receipts.", href: "/dashboard/payments", category: "Payments" },
  { title: "Utility Bill Splitting", desc: "Split shared electricity, water and internet bills fairly.", href: "/dashboard", category: "Tenants" },
  { title: "Maintenance Requests", desc: "Submit repair requests and track progress to resolution.", href: "/dashboard/maintenance", category: "Tenants" },
  { title: "Viewing Schedules", desc: "Book property viewings and get reminders.", href: "/dashboard/viewings", category: "Tenants" },
  { title: "Property Management", desc: "Landlords can list properties, review applications, and track earnings.", href: "/landlord", category: "Landlords" },
  { title: "Platform Admin", desc: "Admins manage users, audit logs, and platform analytics.", href: "/admin", category: "Admin" },
];

export default function ServicesPage() {
  const categories = [...new Set(services.map((s) => s.category))];

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="mb-2 text-3xl font-bold">Services</h1>
      <p className="mb-10 text-muted-foreground">Everything you need to rent, manage, and live well.</p>

      {categories.map((category) => (
        <div key={category} className="mb-12">
          <h2 className="mb-5 flex items-center gap-2 text-xl font-semibold">
            <span className="inline-block size-2 rounded-full bg-primary" /> {category}
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services
              .filter((s) => s.category === category)
              .map((s) => (
                <Link href={s.href} key={s.title}>
                  <div className="group h-full rounded-xl border p-5 transition hover:border-primary hover:shadow-md">
                    <h3 className="mb-2 font-semibold group-hover:text-primary">{s.title}</h3>
                    <p className="mb-4 text-sm text-muted-foreground">{s.desc}</p>
                    <span className="inline-flex items-center gap-1 text-sm text-primary">
                      Learn more <ArrowRight className="size-4" />
                    </span>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      ))}

      <div className="rounded-xl border bg-muted/40 p-8 text-center">
        <h2 className="mb-2 text-xl font-bold">Ready to find your next home?</h2>
        <p className="mb-4 text-muted-foreground">Browse verified listings and apply in minutes.</p>
        <Link href="/properties" className="inline-flex items-center gap-2 text-primary">
          <Search className="size-4" /> Browse properties →
        </Link>
      </div>
    </div>
  );
}
