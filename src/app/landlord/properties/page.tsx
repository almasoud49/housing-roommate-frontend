"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { api, getErrorMessage } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import type { Property } from "@/lib/types";

export default function MyPropertiesPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["my-properties"],
    queryFn: async () => {
      try {
        const r = await api.get("/properties/my-properties");
        return r.data?.data as Property[];
      } catch (err) {
        toast.error(getErrorMessage(err));
        return [];
      }
    },
  });

  if (isLoading) return <Skeleton className="h-64 w-full" />;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Properties</h1>
        <Link href="/landlord/properties/new" className="text-primary">+ Add new</Link>
      </div>
      {!data?.length ? (
        <p className="text-muted-foreground">You haven&apos;t listed any properties yet.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {data.map((p) => (
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
