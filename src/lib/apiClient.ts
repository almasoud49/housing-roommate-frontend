import { ofetch } from "ofetch";
import { clearAccessToken, getAccessToken, setAccessToken } from "@/utils/auth.utils";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

const rawClient = ofetch.create({
  baseURL,
  credentials: "include",
  onRequest({ options }) {
    const token = getAccessToken();
    if (token) {
      options.headers = new Headers(options.headers);
      (options.headers as Headers).set("Authorization", `Bearer ${token}`);
    }
  },
});

// Endpoints where a 401 means "bad credentials", not "expired session".
const NO_REFRESH = ["/auth/login", "/auth/register", "/auth/verify-email", "/auth/google-login", "/auth/forgot-password", "/auth/reset-password", "/auth/refresh-token"];

let refreshing: Promise<string | null> | null = null;

/** Exchange the httpOnly refresh cookie for a new access token (single-flight). */
function refreshAccessToken(): Promise<string | null> {
  refreshing ??= ofetch<{ data?: { accessToken?: string } }>("/auth/refresh-token", {
    baseURL,
    method: "POST",
    credentials: "include",
  })
    .then((res) => {
      const token = res?.data?.accessToken ?? null;
      if (token) setAccessToken(token);
      else clearAccessToken();
      return token;
    })
    .catch(() => null)
    .finally(() => {
      refreshing = null;
    });
  return refreshing;
}

function statusOf(err: unknown): number | undefined {
  return (err as { response?: { status?: number }; statusCode?: number })?.response?.status ?? (err as { statusCode?: number })?.statusCode;
}

/**
 * ofetch client with Bearer auth. On a 401 it tries POST /auth/refresh-token
 * once and replays the original request; if refresh fails the original error
 * is thrown so existing guards (AuthGuard / useGetMe) behave as before.
 */
const apiClient = (async (request: string, options?: Record<string, unknown>) => {
  try {
    return await rawClient(request, options);
  } catch (err) {
    const canRefresh =
      statusOf(err) === 401 &&
      typeof window !== "undefined" &&
      !!getAccessToken() &&
      !NO_REFRESH.some((p) => request.startsWith(p));
    if (!canRefresh) throw err;
    const token = await refreshAccessToken();
    if (!token) throw err;
    return rawClient(request, options);
  }
}) as unknown as typeof rawClient;

export default apiClient;

export function getErrorMessage(err: unknown): string {
  if (err && typeof err === "object" && "data" in err) {
    const data = (err as { data?: { message?: string } }).data;
    if (data?.message) return data.message;
  }
  if (err instanceof Error) return err.message;
  return "Something went wrong";
}
