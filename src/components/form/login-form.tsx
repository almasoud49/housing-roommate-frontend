"use client";

import { useForm } from "@tanstack/react-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { loginSchema } from "@/validation";
import { useState } from "react";
import { useLogin } from "@/hooks";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { decodeJwt, setAccessToken, setRoleCookie } from "@/utils";
import { getErrorMessage } from "@/lib/apiClient";
import { useQueryClient } from "@tanstack/react-query";

const DEMO_ACCOUNTS = [
  { role: "Admin", email: "testeradmin@gmail.com", password: "Tester@admin12345", icon: "👨‍💼" },
  { role: "Landlord", email: "demo.landlord@housing.com", password: "Demo@12345", icon: "🏠" },
  { role: "Tenant", email: "demo.tenant@housing.com", password: "Demo@12345", icon: "👤" },
];

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const { mutate: login, isPending } = useLogin();
  const [demoLoading, setDemoLoading] = useState<string | null>(null);

  const doLogin = (email: string, password: string, key: string) => {
    setDemoLoading(key);
    login(
      { email, password },
      {
        onSuccess: (res: any) => {
          const token = res?.data?.accessToken;
          const user = token ? decodeJwt(token) : null;
          if (!token || !user) {
            toast.error("Invalid login response");
            return;
          }
          setAccessToken(token);
          setRoleCookie(user.role);
          queryClient.removeQueries({ queryKey: ["user"] });
          toast.success(`Welcome back, ${user.name}!`);
          const next = searchParams.get("next");
          router.push(next ?? (user.role === "ADMIN" ? "/admin" : user.role === "LANDLORD" ? "/landlord" : "/dashboard"));
          router.refresh();
        },
        onError: (err) => toast.error(getErrorMessage(err)),
        onSettled: () => setDemoLoading(null),
      },
    );
  };

  const form = useForm({
    defaultValues: { email: "", password: "" },
    validators: { onSubmit: loginSchema },
    onSubmit: ({ value }) => doLogin(value.email, value.password, "form"),
  });

  return (
    <div className="w-full max-w-md space-y-6">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="space-y-4"
      >
        <FieldGroup>
          <form.Field name="email">
            {(field) => (
              <Field>
                <FieldLabel>Email</FieldLabel>
                <Input type="email" value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} onBlur={field.handleBlur} />
                <FieldError errors={field.state.meta.errors} />
              </Field>
            )}
          </form.Field>
          <form.Field name="password">
            {(field) => (
              <Field>
                <FieldLabel>Password</FieldLabel>
                <Input type="password" value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} onBlur={field.handleBlur} />
                <FieldError errors={field.state.meta.errors} />
              </Field>
            )}
          </form.Field>
        </FieldGroup>
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Logging in..." : "🔐 Login"}
        </Button>
      </form>

      <p className="text-center text-sm">
        <Link href="/forgot-password" className="text-primary">Forgot password?</Link>
      </p>

      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <span className="h-px flex-1 bg-border" /> OR <span className="h-px flex-1 bg-border" />
      </div>

      <div>
        <h2 className="mb-4 text-center font-semibold">🚀 Quick Demo Login</h2>
        <div className="grid grid-cols-3 gap-3">
          {DEMO_ACCOUNTS.map((d) => (
            <div key={d.role} className="flex flex-col items-center gap-2 rounded-lg border p-4">
              <span className="text-2xl">{d.icon}</span>
              <span className="text-sm font-medium">{d.role}</span>
              <Button size="sm" variant="outline" disabled={demoLoading !== null} onClick={() => doLogin(d.email, d.password, d.role)}>
                {demoLoading === d.role ? "..." : "Demo Login"}
              </Button>
            </div>
          ))}
        </div>
      </div>

      <p className="text-center text-sm text-muted-foreground">
        No account? <Link href="/register" className="text-primary">Register</Link>
      </p>
    </div>
  );
}
