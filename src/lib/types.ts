export interface Property {
  id: string;
  title: string;
  description: string;
  address: string;
  city: string;
  images?: string[];
  monthlyRent?: number;
  type?: string;
  status?: string;
  rooms?: { id: string; price?: number }[];
  createdAt?: string;
}

export interface Application {
  id: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  createdAt: string;
  message?: string;
  tenant?: { id: string; name: string; email: string };
  applicant?: { id: string; name: string; email: string };
  property?: { id: string; title: string; city?: string };
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

export interface Notification {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface MaintenanceRequest {
  id: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  createdAt: string;
}

export interface ViewingRequest {
  id: string;
  status: string;
  scheduledAt?: string;
  createdAt: string;
  property?: { id: string; title: string };
}

export interface Payment {
  id: string;
  amount: number;
  status: string;
  method?: string;
  createdAt: string;
  application?: { property?: { title: string } };
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "TENANT" | "LANDLORD" | "PROPERTY_MANAGER" | "ADMIN";
  status: "ACTIVE" | "BLOCKED";
  createdAt: string;
}

export interface AuditLog {
  id: string;
  action: string;
  entity?: string;
  createdAt: string;
  user?: { name: string; email: string };
}
