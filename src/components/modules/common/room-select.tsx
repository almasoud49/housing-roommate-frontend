"use client";

import { useRooms } from "@/hooks";
import { NativeSelect } from "@/components/ui/native-select";
import { roomLabel } from "@/types";

/** Dropdown of rooms from GET /rooms. Pass `activeOnly` to hide unavailable rooms. */
export function RoomSelect({
  value,
  onChange,
  activeOnly,
}: {
  value: string;
  onChange: (id: string) => void;
  activeOnly?: boolean;
}) {
  const { data, isLoading } = useRooms({ limit: 50, ...(activeOnly ? { isActive: true } : {}) });
  const rooms = data?.data ?? [];
  return (
    <NativeSelect value={value} onChange={(e) => onChange(e.target.value)} disabled={isLoading}>
      <option value="">{isLoading ? "Loading rooms..." : "Select a room..."}</option>
      {rooms.map((r) => (
        <option key={r.id} value={r.id}>
          {roomLabel(r)}
          {r.price ? ` — ৳${r.price}/mo` : ""}
        </option>
      ))}
    </NativeSelect>
  );
}
