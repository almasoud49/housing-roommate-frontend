"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useAdminUsers, useCurrentUser, useDeleteUser, useToggleUserStatus, useUpdateUserRole } from "@/hooks";
import { getErrorMessage } from "@/lib/apiClient";
import type { AdminUser, UserRole } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { NativeSelect } from "@/components/ui/native-select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ConfirmButton, ListState, PageHeader, PaginationBar, StatusBadge } from "@/components/modules/common";
import { formatDate, humanize } from "@/utils/format.util";

const ROLES: UserRole[] = ["TENANT", "LANDLORD", "PROPERTY_MANAGER", "ADMIN"];
const onError = (e: unknown) => toast.error(getErrorMessage(e));

export default function AdminUsersPage() {
  const { user: me } = useCurrentUser();
  const [page, setPage] = useState(1);
  const [role, setRole] = useState<UserRole | "">("");
  const [status, setStatus] = useState<"ACTIVE" | "BLOCKED" | "">("");
  const [search, setSearch] = useState("");
  const { data, isLoading, error } = useAdminUsers({ page, limit: 10, role: role || undefined, status: status || undefined, search: search || undefined });
  const toggle = useToggleUserStatus();
  const changeRole = useUpdateUserRole();
  const remove = useDeleteUser();
  const users: AdminUser[] = data?.data ?? [];

  return (
    <div>
      <PageHeader title="User Management" />
      <div className="mb-4 flex flex-wrap gap-3">
        <Input className="w-64" placeholder="Search name or email..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
        <NativeSelect className="w-44" value={role} onChange={(e) => { setRole(e.target.value as UserRole | ""); setPage(1); }}>
          <option value="">All roles</option>
          {ROLES.map((r) => <option key={r} value={r}>{humanize(r)}</option>)}
        </NativeSelect>
        <NativeSelect className="w-44" value={status} onChange={(e) => { setStatus(e.target.value as typeof status); setPage(1); }}>
          <option value="">All statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="BLOCKED">Blocked</option>
        </NativeSelect>
      </div>

      <ListState isLoading={isLoading} error={error} isEmpty={!users.length} emptyText="No users found.">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((u) => {
              const isSelf = u.id === me?.id;
              return (
                <TableRow key={u.id}>
                  <TableCell>{u.name}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>
                    <NativeSelect className="w-40" value={u.role} disabled={isSelf || changeRole.isPending} onChange={(e) => changeRole.mutate({ id: u.id, role: e.target.value as UserRole }, { onSuccess: () => toast.success("Role updated"), onError })}>
                      {ROLES.map((r) => <option key={r} value={r}>{humanize(r)}</option>)}
                    </NativeSelect>
                  </TableCell>
                  <TableCell><StatusBadge value={u.status} /></TableCell>
                  <TableCell>{formatDate(u.createdAt)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" disabled={isSelf || toggle.isPending} onClick={() => toggle.mutate({ id: u.id, status: u.status === "ACTIVE" ? "BLOCKED" : "ACTIVE" }, { onSuccess: () => toast.success("Status updated"), onError })}>
                        {u.status === "ACTIVE" ? "Block" : "Unblock"}
                      </Button>
                      <ConfirmButton size="sm" variant="destructive" disabled={isSelf} title={`Delete ${u.name}?`} description="This permanently removes the account." confirmLabel="Delete user" pending={remove.isPending} onConfirm={() => remove.mutate(u.id, { onSuccess: () => toast.success("User deleted"), onError })}>
                        Delete
                      </ConfirmButton>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <PaginationBar meta={data?.meta} onPageChange={setPage} />
      </ListState>
    </div>
  );
}
