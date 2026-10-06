"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { AuditLog } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

export default function AuditLogsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["audit-logs"],
    queryFn: async () => {
      const res = await api.get("/admin/audit-logs");
      const d = res.data?.data;
      return (Array.isArray(d) ? d : d?.data ?? []) as AuditLog[];
    },
  });

  if (isLoading) return <Skeleton className="h-64 w-full" />;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Audit Logs</h1>
      {!data?.length ? (
        <p className="text-muted-foreground">No audit logs yet.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Action</TableHead>
              <TableHead>Entity</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((log) => (
              <TableRow key={log.id}>
                <TableCell>{log.action}</TableCell>
                <TableCell>{log.entity ?? "—"}</TableCell>
                <TableCell>{log.user?.email ?? "—"}</TableCell>
                <TableCell>{new Date(log.createdAt).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
