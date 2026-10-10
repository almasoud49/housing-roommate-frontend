"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useProperties } from "@/hooks";
import type { Property } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

function PropertiesBrowser() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const search = searchParams.get("search") ?? "";
  const city = searchParams.get("city") ?? "";
  const page = searchParams.get("page") ?? "1";
  const sortBy = searchParams.get("sortBy") ?? "createdAt";
  const [q, setQ] = useState(search);

  const { data, isLoading } = useProperties({
    search: search || undefined,
    city: city || undefined,
    page: Number(page) || 1,
    limit: 9,
    sortBy: (["createdAt", "title", "city"].includes(sortBy) ? sortBy : "createdAt") as "createdAt" | "title" | "city",
  });
  const properties: Property[] | undefined = data?.data;

  const update = (params: Record<string, string>) => {
    const sp = new URLSearchParams(searchParams.toString());
    Object.entries(params).forEach(([k, v]) => (v ? sp.set(k, v) : sp.delete(k)));
    if (!("page" in params)) sp.set("page", "1");
    router.push(`/properties?${sp.toString()}`);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="mb-6 text-3xl font-bold">Browse Properties</h1>
      <div className="mb-8 flex flex-col gap-3 sm:flex-row">
        <form className="flex flex-1 gap-2" onSubmit={(e) => { e.preventDefault(); update({ search: q }); }}>
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by title or address..." />
          <Button type="submit">Search</Button>
        </form>
        <Input className="sm:w-48" placeholder="City (e.g. Dhaka)" defaultValue={city} onBlur={(e) => update({ city: e.target.value })} />
        <select className="h-9 rounded-md border px-3 text-sm" value={sortBy} onChange={(e) => update({ sortBy: e.target.value })}>
          <option value="createdAt">Newest</option>
          <option value="title">Title</option>
          <option value="city">City</option>
        </select>
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-40 w-full" />)}
        </div>
      ) : !properties || properties.length === 0 ? (
        <div className="rounded-xl border border-dashed p-16 text-center text-muted-foreground">
          No properties found. Try adjusting your filters.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          {properties.map((p) => (
            <Link href={`/properties/${p.id}`} key={p.id}>
              <Card className="h-full transition hover:shadow-md">
                <CardContent className="flex h-full flex-col gap-2 p-5">
                  <h3 className="font-semibold">{p.title}</h3>
                  <p className="text-sm text-muted-foreground">{p.address}, {p.city}</p>
                  <p className="text-sm line-clamp-3">{p.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-8 flex items-center justify-center gap-3">
        <Button variant="outline" size="sm" disabled={Number(page) <= 1} onClick={() => update({ page: String(Number(page) - 1) })}>Previous</Button>
        <span className="text-sm">Page {page}</span>
        <Button variant="outline" size="sm" disabled={!properties || properties.length < 9} onClick={() => update({ page: String(Number(page) + 1) })}>Next</Button>
      </div>
    </div>
  );
}

export default function PropertiesPage() {
  return (
    <Suspense>
      <PropertiesBrowser />
    </Suspense>
  );
}
