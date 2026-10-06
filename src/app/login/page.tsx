"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { api, getErrorMessage, type ApiSuccess } from "@/lib/api";
import { parseUserFromToken, useAuth } from "@/store/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
type FormData = z.infer<typeof schema>;

const DEMO_ACCOUNTS = [
  { role: "Admin", email: "testeradmin@gmail.com", password: "Tester@admin12345", icon: "👨‍💼" },
  { role: "Landlord", email: "demo.landlord@housing.com", password: "Demo@12345", icon: "🏠" },
  { role: "Tenant", email: "demo.tenant@housing.com", password: "Demo@12345", icon: "👤" },
];

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAuth = useAuth((s) => s.setAuth);
  const [loadingRole, setLoadingRole] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) });

  const doLogin = async (email: string, password: string, roleLabel?: string) => {
    const key = roleLabel ?? "credentials";
    setLoadingRole(key);
    try {
      const res = await api.post<ApiSuccess<{ accessToken: string }>>("/auth/login", { email, password });
      const token = res.data.data.accessToken;
      const user = parseUserFromToken(token);
      if (!user) throw new Error("Could not parse user from token");
      setAuth(token, user);
      toast.success(`Welcome back, ${user.name}!`);
      const next = searchParams.get("next");
      router.push(next ?? (user.role === "ADMIN" ? "/admin" : user.role === "LANDLORD" ? "/landlord" : "/dashboard"));
      router.refresh();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoadingRole(null);
    }
  };

  return (
    <div className="mx-auto flex max-w-md flex-col gap-6 px-4 py-16">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Welcome Back 👋</h1>
        <p className="text-muted-foreground">Login to your account</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit((d) => doLogin(d.email, d.password))} className="space-y-4">
            <div>
              <Input placeholder="Email" type="email" {...register("email")} />
              {errors.email && <p className="mt-1 text-sm text-destructive">{errors.email.message}</p>}
            </div>
            <div>
              <Input placeholder="Password" type="password" {...register("password")} />
              {errors.password && <p className="mt-1 text-sm text-destructive">{errors.password.message}</p>}
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting || loadingRole !== null}>
              {isSubmitting ? "Logging in..." : "🔐 Login"}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm">
            <Link href="/forgot-password" className="text-primary">Forgot password?</Link>
          </p>
        </CardContent>
      </Card>

      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <span className="h-px flex-1 bg-border" /> OR <span className="h-px flex-1 bg-border" />
      </div>

      <div>
        <h2 className="mb-4 text-center font-semibold">🚀 Quick Demo Login</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {DEMO_ACCOUNTS.map((d) => (
            <Card key={d.role}>
              <CardHeader className="p-4 pb-2 text-center text-lg">{d.icon}</CardHeader>
              <CardContent className="flex flex-col items-center gap-3 p-4 pt-0">
                <CardTitle className="text-sm">{d.role}</CardTitle>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={loadingRole !== null}
                  onClick={() => doLogin(d.email, d.password, d.role)}
                >
                  {loadingRole === d.role ? "..." : "Demo Login"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <p className="text-center text-sm text-muted-foreground">
        No account? <Link href="/register" className="text-primary">Register</Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
