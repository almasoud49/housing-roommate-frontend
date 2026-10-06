"use client";

import Link from "next/link";
import { useMyProperties } from "@/hooks";
import type { Property } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function MyPropertiesPage() {
  const { data, isLoading } = useMyProperties();
  const properties = data?.data as Property[] | undefined;

  if (isLoading) return <Skeleton className="h-64 w-full" />;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Properties</h1>
        <Link href="/landlord/properties/new" className="text-primary">+ Add new</Link>
      </div>
      {!properties?.length ? (
        <p className="text-muted-foreground">You haven&apos;t listed any properties yet.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {properties.map((p) => (
            <Card key={p.id}>
              <CardContent className="p-5">
                <h3 className="font-semibold">{p.title}</h3>
                <p className="text-sm text-muted-foreground">{p.address}, {p.city}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
