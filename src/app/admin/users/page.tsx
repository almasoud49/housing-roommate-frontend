"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { api, getErrorMessage, type ApiSuccess } from "@/lib/api";
import type { AdminUser } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

function UsersTable() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleFilter = searchParams.get("role") ?? "";
  const statusFilter = searchParams.get("status") ?? "";
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-users", roleFilter, statusFilter],
    queryFn: async () => {
      const sp = new URLSearchParams();
      if (roleFilter) sp.set("role", roleFilter);
      if (statusFilter) sp.set("status", statusFilter);
      const res = await api.get(`/admin/users?${sp.toString()}`);
      const d = res.data?.data;
      return (Array.isArray(d) ? d : d?.data ?? []) as AdminUser[];
    },
  });

  const toggleStatus = useMutation({
    mutationFn: async (u: AdminUser) =>
      api.patch(`/admin/users/${u.id}/status`, { status: u.status === "ACTIVE" ? "BLOCKED" : "ACTIVE" }),
    onSuccess: () => { toast.success("Status updated"); qc.invalidateQueries({ queryKey: ["admin-users"] }); },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  const update = (key: string, value: string) => {
    const sp = new URLSearchParams(searchParams.toString());
    value ? sp.set(key, value) : sp.delete(key);
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
      ) : !data?.length ? (
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
            {data.map((u) => (
              <TableRow key={u.id}>
                <TableCell>{u.name}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell><Badge variant="secondary">{u.role}</Badge></TableCell>
                <TableCell><Badge variant={u.status === "ACTIVE" ? "default" : "destructive"}>{u.status}</Badge></TableCell>
                <TableCell>{new Date(u.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Button size="sm" variant="outline" onClick={() => toggleStatus.mutate(u)}>
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
