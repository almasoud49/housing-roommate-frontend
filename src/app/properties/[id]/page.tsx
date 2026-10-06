import Link from "next/link";
import { serverFetch } from "@/lib/server-fetch";
import type { Property } from "@/lib/types";
import { ApplyButton } from "@/components/apply-button";

interface PropertyWithBuildings extends Property {
  buildings?: {
    id: string;
    name: string;
    flats: { id: string; flatNumber: string; rooms: { id: string; name: string; price: number; isActive: boolean }[] }[];
  }[];
}

export default async function PropertyDetailPage({ params }: PageProps<"/properties/[id]">) {
  const { id } = await params;
  const property = await serverFetch<PropertyWithBuildings>(`/properties/${id}`);

  if (!property) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="mb-4 text-2xl font-bold">Property not found</h1>
        <Link href="/properties" className="text-primary">← Back to listings</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <Link href="/properties" className="text-sm text-primary">← Back to listings</Link>
      <h1 className="mb-2 mt-4 text-3xl font-bold">{property.title}</h1>
      <p className="mb-6 text-muted-foreground">{property.address}, {property.city}</p>
      <p className="leading-relaxed">{property.description}</p>

      <h2 className="mb-3 mt-10 text-xl font-semibold">Available Rooms</h2>
      <div className="space-y-2">
        {property.buildings?.flatMap((b) =>
          b.flats.flatMap((f) =>
            f.rooms.map((r) => (
              <div key={r.id} className="flex items-center justify-between rounded-lg border p-3 text-sm">
                <span>{b.name} · Flat {f.flatNumber} · {r.name}</span>
                <span className="font-medium">{r.isActive ? `৳${r.price}/mo` : "Unavailable"}</span>
              </div>
            )),
          ),
        ) ?? <p className="text-muted-foreground">Room details unavailable.</p>}
      </div>

      <div className="mt-8 rounded-xl border p-6">
        <h2 className="mb-2 font-semibold">Interested in this place?</h2>
        <p className="mb-4 text-sm text-muted-foreground">Create an account to apply, book a viewing, or message the owner.</p>
        <ApplyButton rooms={property.buildings?.flatMap((b) => b.flats.flatMap((f) => f.rooms)) ?? []} />
      </div>
    </div>
  );
}
