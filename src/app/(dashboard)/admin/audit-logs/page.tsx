"use client";

import { useAuditLogs } from "@/hooks";
import type { AuditLog } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function AuditLogsPage() {
  const { data, isLoading } = useAuditLogs();
  const d = data?.data as unknown;
  const logs: AuditLog[] = Array.isArray(d) ? d : ((d as { data?: AuditLog[] })?.data ?? []);

  if (isLoading) return <Skeleton className="h-64 w-full" />;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Audit Logs</h1>
      {!logs.length ? (
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
            {logs.map((log) => (
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
