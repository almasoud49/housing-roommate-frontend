export interface MaintenanceRequest {
  id: string;
  title: string;
  description: string;
  category?: string;
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

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface MatchItem {
  id: string;
  status?: string;
  matchedWith?: { name?: string };
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
