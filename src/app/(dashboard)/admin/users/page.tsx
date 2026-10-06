"use client";

import { useAdminUsers, useToggleUserStatus } from "@/hooks";
import type { AdminUser } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/apiClient";
import { useQueryClient } from "@tanstack/react-query";

function UsersTable() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleFilter = searchParams.get("role") ?? "";
  const statusFilter = searchParams.get("status") ?? "";
  const qc = useQueryClient();
  const { data, isLoading } = useAdminUsers({
    role: roleFilter || undefined,
    status: statusFilter || undefined,
  });
  const { mutate: toggleStatus } = useToggleUserStatus();

  const d = data?.data as unknown;
  const users: AdminUser[] = Array.isArray(d) ? d : ((d as { data?: AdminUser[] })?.data ?? []);

  const update = (key: string, value: string) => {
    const sp = new URLSearchParams(searchParams.toString());
    if (value) sp.set(key, value);
    else sp.delete(key);
    router.push(`/admin/users?${sp.toString()}`);
  };

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">User Management</h1>
      <div className="mb-4 flex gap-3">
        <select className="h-9 rounded-md border px-3 text-sm" value={roleFilter} onChange={(e) => update("role", e.target.value)}>
          <option value="">All roles</option>
          <option value="TENANT">Tenant</option>
          <option value="LANDLORD">Landlord</option>
          <option value="PROPERTY_MANAGER">Manager</option>
          <option value="ADMIN">Admin</option>
        </select>
        <select className="h-9 rounded-md border px-3 text-sm" value={statusFilter} onChange={(e) => update("status", e.target.value)}>
          <option value="">All statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="BLOCKED">Blocked</option>
        </select>
      </div>

      {isLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : !users.length ? (
        <p className="text-muted-foreground">No users found.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((u) => (
              <TableRow key={u.id}>
                <TableCell>{u.name}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{u.role}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={u.status === "ACTIVE" ? "default" : "destructive"}>{u.status}</Badge>
                </TableCell>
                <TableCell>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "-"}</TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      toggleStatus(
                        { id: u.id, status: u.status === "ACTIVE" ? "BLOCKED" : "ACTIVE" },
                        {
                          onSuccess: () => {
                            toast.success("Status updated");
                            qc.invalidateQueries({ queryKey: ["admin-users"] });
                          },
                          onError: (e) => toast.error(getErrorMessage(e)),
                        },
                      )
                    }
                  >
                    {u.status === "ACTIVE" ? "Block" : "Unblock"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

export default function AdminUsersPage() {
  return (
    <Suspense>
      <UsersTable />
    </Suspense>
  );
}
