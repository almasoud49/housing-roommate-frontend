const TOKEN_KEY = "accessToken";

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setAccessToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearAccessToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function setRoleCookie(role: string | null) {
  if (typeof document === "undefined") return;
  document.cookie = role
    ? `hr_role=${role}; path=/; max-age=${60 * 60 * 24 * 7}; samesite=lax`
    : "hr_role=; path=/; max-age=0";
}

export interface TokenUser {
  userId: string;
  email: string;
  name: string;
  role: "TENANT" | "LANDLORD" | "PROPERTY_MANAGER" | "ADMIN";
}

export function decodeJwt(token: string): TokenUser | null {
  try {
    const payload = JSON.parse(
      atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")),
    );
    if (!payload?.userId || !payload?.role) return null;
    return {
      userId: payload.userId,
      email: payload.email,
      name: payload.name ?? payload.email?.split("@")[0] ?? "User",
      role: payload.role,
    };
  } catch {
    return null;
  }
}
