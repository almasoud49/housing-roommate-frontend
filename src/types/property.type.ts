export interface Property {
  id: string;
  title: string;
  description: string;
  address: string;
  city: string;
  images?: string[];
  createdAt?: string;
  buildings?: Building[];
}

export interface Building {
  id: string;
  name: string;
  address?: string;
  city?: string;
  flatNumber?: string;
  flats: Flat[];
}

export interface Flat {
  id: string;
  flatNumber: string;
  floor?: number;
  rooms: Room[];
}

export interface Room {
  id: string;
  name: string;
  price?: number;
  isActive: boolean;
}

export interface Application {
  id: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  createdAt: string;
  message?: string;
  tenant?: { id: string; name: string; email: string };
  property?: { id: string; title: string };
  room?: {
    id: string;
    name: string;
    price?: number;
    flat?: { flatNumber: string; building?: { name: string; property?: { id: string; title: string } } };
  };
}

export function applicationTitle(a: Application): string {
  return a.property?.title ?? a.room?.flat?.building?.property?.title ?? "Property";
}
