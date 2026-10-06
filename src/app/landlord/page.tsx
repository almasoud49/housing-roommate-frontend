"use client";

import { useQuery } from "@tanstack/react-query";
import { api, type ApiSuccess } from "@/lib/api";
import { applicationTitle, type Property, type Application } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LandlordOverview() {
  const props = useQuery({
    queryKey: ["my-properties"],
    queryFn: async () => (await api.get<ApiSuccess<Property[]>>("/properties/my-properties")).data.data,
  });
  const apps = useQuery({
    queryKey: ["landlord-applications"],
    queryFn: async () => (await api.get<ApiSuccess<Application[]>>("/applications/landlord")).data.data,
  });

  const pending = apps.data?.filter((a) => a.status === "PENDING") ?? [];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Landlord Overview</h1>
        <Button render={<Link href="/landlord/properties/new" />}>+ Add Property</Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <Card><CardContent className="p-6">{props.isLoading ? <Skeleton className="h-8 w-16" /> : <p className="text-3xl font-bold">{props.data?.length ?? 0}</p>}<p className="text-sm text-muted-foreground">Properties</p></CardContent></Card>
        <Card><CardContent className="p-6">{apps.isLoading ? <Skeleton className="h-8 w-16" /> : <p className="text-3xl font-bold">{apps.data?.length ?? 0}</p>}<p className="text-sm text-muted-foreground">Total Applications</p></CardContent></Card>
        <Card><CardContent className="p-6">{apps.isLoading ? <Skeleton className="h-8 w-16" /> : <p className="text-3xl font-bold">{pending.length}</p>}<p className="text-sm text-muted-foreground">Pending Review</p></CardContent></Card>
      </div>

      <h2 className="mb-4 mt-10 text-xl font-semibold">Pending Applications</h2>
      {apps.isLoading ? <Skeleton className="h-32 w-full" /> : pending.length === 0 ? (
        <p className="text-muted-foreground">No pending applications.</p>
      ) : (
        <div className="space-y-3">
          {pending.slice(0, 5).map((a) => (
            <div key={a.id} className="flex items-center justify-between rounded-lg border p-4">
              <span>{a.tenant?.name ?? a.applicant?.name ?? "Applicant"} — {applicationTitle(a)}</span>
              <Link href="/landlord/applications" className="text-sm text-primary">Review →</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
