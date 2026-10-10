"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { useDeleteProperty, useMyProperties } from "@/hooks";
import { getErrorMessage } from "@/lib/apiClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ConfirmButton, ListState, PageHeader, PaginationBar } from "@/components/modules/common";

export default function MyPropertiesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const { data, isLoading, error } = useMyProperties({ page, limit: 9, search: search || undefined });
  const remove = useDeleteProperty();
  const properties = data?.data ?? [];

  return (
    <div>
      <PageHeader title="My Properties" action={<Button render={<Link href="/landlord/properties/new" />}>+ Add property</Button>} />
      <Input className="mb-4 w-72" placeholder="Search properties..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
      <ListState isLoading={isLoading} error={error} isEmpty={!properties.length} emptyText="You haven't listed any properties yet.">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {properties.map((p) => (
            <Card key={p.id}>
              <CardContent className="space-y-3 p-5">
                <div>
                  <h3 className="font-semibold">{p.title}</h3>
                  <p className="text-sm text-muted-foreground">{p.address}, {p.city}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" render={<Link href={`/landlord/properties/${p.id}`} />}>Manage</Button>
                  <ConfirmButton size="sm" variant="destructive" title={`Delete ${p.title}?`} description="Buildings, flats and rooms under it will be removed." confirmLabel="Delete" pending={remove.isPending} onConfirm={() => remove.mutate(p.id, { onSuccess: () => toast.success("Property deleted"), onError: (e) => toast.error(getErrorMessage(e)) })}>
                    Delete
                  </ConfirmButton>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <PaginationBar meta={data?.meta} onPageChange={setPage} />
      </ListState>
    </div>
  );
}
