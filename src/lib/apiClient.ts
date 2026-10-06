import { ofetch } from "ofetch";
import { getAccessToken } from "@/utils/auth.utils";

const apiClient = ofetch.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  credentials: "include",
  onRequest({ options }) {
    const token = getAccessToken();
    if (token) {
      options.headers = new Headers(options.headers);
      (options.headers as Headers).set("Authorization", `Bearer ${token}`);
    }
  },
});

export default apiClient;

export function getErrorMessage(err: unknown): string {
  if (err && typeof err === "object" && "data" in err) {
    const data = (err as { data?: { message?: string } }).data;
    if (data?.message) return data.message;
  }
  if (err instanceof Error) return err.message;
  return "Something went wrong";
}
