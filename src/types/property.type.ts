export interface Property {
  id: string;
  landlordId?: string;
  title: string;
  description: string;
  address: string;
  city: string;
  images?: string[];
  createdAt?: string;
  buildings?: Building[];
  landlord?: { id: string; name: string; email?: string };
}

export interface Building {
  id: string;
  propertyId?: string;
  name: string;
  address?: string;
  city?: string;
  floors?: number;
  flatNumber?: string;
  deletedAt?: string | null;
  flats: Flat[];
}

export interface Flat {
  id: string;
  buildingId?: string;
  flatNumber: string;
  floor?: number;
  deletedAt?: string | null;
  rooms: Room[];
  building?: Pick<Building, "id" | "name" | "address" | "city"> & {
    property?: { id: string; title: string; landlordId?: string };
  };
}

export interface Room {
  id: string;
  flatId?: string;
  name: string;
  price?: number;
  availableFrom?: string | null;
  availableTo?: string | null;
  isActive: boolean;
  flat?: {
    id: string;
    flatNumber: string;
    floor?: number;
    building?: {
      id: string;
      name: string;
      address?: string;
      city?: string;
      property?: { id: string; title: string; landlordId?: string };
    };
  };
}

export type ApplicationStatus = "PENDING" | "ACCEPTED" | "REJECTED";

export interface Application {
  id: string;
  status: ApplicationStatus;
  createdAt: string;
  message?: string;
  roomId?: string;
  tenantId?: string;
  tenant?: { id: string; name: string; email: string };
  property?: { id: string; title: string };
  payment?: { id: string; status: PaymentStatus; amount: number } | null;
  room?: {
    id: string;
    name: string;
    price?: number;
    flat?: { flatNumber: string; building?: { name: string; property?: { id: string; title: string; landlordId?: string } } };
  };
}

export function applicationTitle(a: Application): string {
  return a.property?.title ?? a.room?.flat?.building?.property?.title ?? "Property";
}

export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";

/** Human-readable "Building · Flat 3B · Room 1" label for a room (works with partial data). */
export function roomLabel(r?: Room | Application["room"] | null): string {
  if (!r) return "Room";
  const flat = r.flat;
  const parts = [
    flat?.building?.property?.title,
    flat?.building?.name,
    flat?.flatNumber ? `Flat ${flat.flatNumber}` : undefined,
    r.name,
  ].filter(Boolean);
  return parts.join(" · ");
}
