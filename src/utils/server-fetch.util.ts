import { ApiResponse } from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function serverFetch<T>(path: string, revalidate = 60): Promise<T | null> {
  try {
    const res = await fetch(`${BASE_URL}${path}`, { next: { revalidate } });
    const json = (await res.json()) as ApiResponse<T>;
    if (!res.ok) return null;
    return json?.data ?? null;
  } catch {
    return null;
  }
}
