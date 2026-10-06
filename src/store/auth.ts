import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Role = "TENANT" | "LANDLORD" | "PROPERTY_MANAGER" | "ADMIN";

export interface AuthUser {
  userId: string;
  email: string;
  name: string;
  role: Role;
}

interface AuthState {
  accessToken: string | null;
  user: AuthUser | null;
  setAuth: (accessToken: string, user: AuthUser) => void;
  clearAuth: () => void;
}

function setRoleCookie(role: Role | null) {
  if (typeof document === "undefined") return;
  if (role) {
    document.cookie = `hr_role=${role}; path=/; max-age=${60 * 60 * 24 * 7}; samesite=lax`;
  } else {
    document.cookie = "hr_role=; path=/; max-age=0";
  }
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      user: null,
      setAuth: (accessToken, user) => {
        setRoleCookie(user.role);
        set({ accessToken, user });
      },
      clearAuth: () => {
        setRoleCookie(null);
        set({ accessToken: null, user: null });
      },
    }),
    { name: "hr-auth" },
  ),
);

export function decodeJwt(token: string): Partial<AuthUser> | null {
  try {
    const payload = token.split(".")[1];
    const json = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
    return json;
  } catch {
    return null;
  }
}

export function parseUserFromToken(token: string): AuthUser | null {
  const payload = decodeJwt(token);
  if (!payload?.userId || !payload?.email || !payload?.role) return null;
  return {
    userId: payload.userId,
    email: payload.email,
    name: payload.name ?? payload.email.split("@")[0],
    role: payload.role as Role,
  };
}
