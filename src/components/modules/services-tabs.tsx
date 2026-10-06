"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const services = [
  { title: "Verified Property Listings", desc: "Browse apartments, houses and rooms verified by our team.", href: "/properties", category: "Browse" },
  { title: "Roommate Matching", desc: "Set lifestyle preferences and get matched with compatible roommates.", href: "/dashboard/roommate", category: "Tenants" },
  { title: "Application Workflow", desc: "Apply to a property in minutes and track your application status.", href: "/dashboard/applications", category: "Tenants" },
  { title: "Utility Bill Splitting", desc: "Split shared electricity, water and internet bills fairly.", href: "/dashboard", category: "Tenants" },
  { title: "Maintenance Requests", desc: "Submit repair requests and track progress to resolution.", href: "/dashboard/maintenance", category: "Tenants" },
  { title: "Viewing Schedules", desc: "Book property viewings and get reminders.", href: "/dashboard/viewings", category: "Tenants" },
  { title: "Secure Rent Payments", desc: "Pay deposits and rent online via bKash with full receipts.", href: "/dashboard/payments", category: "Payments" },
  { title: "Property Management", desc: "Landlords can list properties, review applications, and track earnings.", href: "/landlord", category: "Landlords" },
  { title: "Platform Admin", desc: "Admins manage users, audit logs, and platform analytics.", href: "/admin", category: "Admin" },
];

const categories = [...new Set(services.map((s) => s.category))];

export default function ServicesTabs() {
  return (
    <Tabs defaultValue={categories[0]} className="items-center">
      <TabsList className="mb-10">
        {categories.map((c) => (
          <TabsTrigger key={c} value={c} className="px-4">
            {c}
          </TabsTrigger>
        ))}
      </TabsList>

      {categories.map((c) => (
        <TabsContent key={c} value={c} className="w-full">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services
              .filter((s) => s.category === c)
              .map((s) => (
                <Link href={s.href} key={s.title}>
                  <div className="group flex h-full flex-col rounded-xl border bg-card p-6 transition hover:border-primary hover:shadow-md">
                    <h3 className="mb-2 font-semibold transition group-hover:text-primary">{s.title}</h3>
                    <p className="mb-6 flex-1 text-sm text-muted-foreground">{s.desc}</p>
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
                      Learn more <ArrowRight className="size-4 transition group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              ))}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
