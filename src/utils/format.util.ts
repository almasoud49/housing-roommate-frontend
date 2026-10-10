export function formatDate(value?: string | Date | null): string {
  if (!value) return "—";
  return new Date(value).toLocaleDateString();
}

export function formatDateTime(value?: string | Date | null): string {
  if (!value) return "—";
  return new Date(value).toLocaleString();
}

export function formatMoney(value?: number | null, currency = "BDT"): string {
  if (value === undefined || value === null) return "—";
  const symbol = currency === "BDT" ? "৳" : `${currency} `;
  return `${symbol}${value.toLocaleString()}`;
}

/** "IN_PROGRESS" -> "In progress" */
export function humanize(value?: string | null): string {
  if (!value) return "";
  const s = value.replace(/_/g, " ").toLowerCase();
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** `<input type="datetime-local">` / `type="date"` value -> ISO string accepted by the API (zod .datetime()) */
export function toIso(value: string): string | undefined {
  if (!value) return undefined;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? undefined : d.toISOString();
}
