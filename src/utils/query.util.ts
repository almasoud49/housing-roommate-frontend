export type QueryParams = Record<string, string | number | boolean | undefined | null>;

/** Build a `?a=1&b=2` string, skipping empty values. Returns "" when nothing to send. */
export function buildQuery(params?: QueryParams): string {
  if (!params) return "";
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null || v === "") continue;
    sp.set(k, String(v));
  }
  const s = sp.toString();
  return s ? `?${s}` : "";
}

/** Common pagination/sort params accepted by every list endpoint. */
export interface ListParams extends QueryParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
