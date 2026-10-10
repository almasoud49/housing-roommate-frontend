export type UserRole = "TENANT" | "LANDLORD" | "PROPERTY_MANAGER" | "ADMIN";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status?: "ACTIVE" | "BLOCKED";
  isVerified?: boolean;
  createdAt?: string;
  profile?: { phoneNumber?: string; bio?: string; avatarUrl?: string; preferences?: string };
}

/** PATCH /users/me — flat body, `name` is not accepted by the backend. */
export interface UpdateProfilePayload {
  phoneNumber?: string;
  bio?: string;
  avatarUrl?: string;
  preferences?: string;
}
