export type UserRole = "TENANT" | "LANDLORD" | "PROPERTY_MANAGER" | "ADMIN";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status?: "ACTIVE" | "BLOCKED";
  createdAt?: string;
  profile?: { phoneNumber?: string; bio?: string; avatarUrl?: string };
}
