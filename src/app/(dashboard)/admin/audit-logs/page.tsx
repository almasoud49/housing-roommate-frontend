"use client";

import { useState } from "react";
import { useAuditLogs } from "@/hooks";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ListState, PageHeader, PaginationBar } from "@/components/modules/common";
import { formatDateTime } from "@/utils/format.util";

export default function AuditLogsPage() {
  const [page, setPage] = useState(1);
  const [action, setAction] = useState("");
  const [entityType, setEntityType] = useState("");
  const { data, isLoading, error } = useAuditLogs({ page, limit: 15, action: action || undefined, entityType: entityType || undefined });
  const logs = data?.data ?? [];

  return (
    <div>
      <PageHeader title="Audit Logs" />
      <div className="mb-4 flex flex-wrap gap-3">
        <Input className="w-56" placeholder="Filter by action..." value={action} onChange={(e) => { setAction(e.target.value); setPage(1); }} />
        <Input className="w-56" placeholder="Filter by entity type..." value={entityType} onChange={(e) => { setEntityType(e.target.value); setPage(1); }} />
      </div>
      <ListState isLoading={isLoading} error={error} isEmpty={!logs.length} emptyText="No audit logs found.">
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
                <TableCell>{log.entityType ?? "—"}</TableCell>
                <TableCell>{log.user?.email ?? "—"}</TableCell>
                <TableCell>{formatDateTime(log.createdAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <PaginationBar meta={data?.meta} onPageChange={setPage} />
      </ListState>
    </div>
  );
}
