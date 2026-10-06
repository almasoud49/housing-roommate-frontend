import { API_URL } from "./api";

export async function serverFetch<T>(path: string, revalidate = 60): Promise<T | null> {
  try {
    const res = await fetch(`${API_URL}${path}`, { next: { revalidate } });
    const json = await res.json();
    if (!res.ok) return null;
    return (json?.data ?? json) as T;
  } catch {
    return null;
  }
}
