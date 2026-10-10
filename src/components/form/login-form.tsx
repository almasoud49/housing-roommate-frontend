"use client";

import { useForm } from "@tanstack/react-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { loginSchema } from "@/validation";
import { useState } from "react";
import { useLogin } from "@/hooks";
import Link from "next/link";
import { AlertCircle, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { getErrorMessage } from "@/lib/apiClient";
import GoogleSignIn, { googleClientId } from "./google-sign-in";
import { useFinishLogin, useGoogleSession } from "./use-finish-login";

const DEMO_ACCOUNTS = [
  { role: "Admin", email: "testeradmin@gmail.com", password: "Tester@admin12345", icon: "👑" },
  { role: "Tenant", email: "demo.tenant@housing.com", password: "Demo@12345", icon: "👤" },
  { role: "Landlord", email: "demo.landlord@housing.com", password: "Demo@12345", icon: "🏠" },
];

/** Friendly message for a failed login; falls back to the backend's own message. */
function loginErrorMessage(err: unknown): string {
  const status = (err as { status?: number; statusCode?: number })?.status ?? (err as { statusCode?: number })?.statusCode;
  if (status === 429) return "Too many attempts. Please wait a few minutes and try again.";
  // No HTTP status means the request never got a response (offline, CORS, server down).
  if (!status) return "Can't reach the server. Check your connection and try again.";
  return getErrorMessage(err);
}

export default function LoginForm() {
  const { mutate: login, isPending } = useLogin();
  const finishLogin = useFinishLogin();
  const doGoogleLogin = useGoogleSession();
  const [demoLoading, setDemoLoading] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const doLogin = (email: string, password: string, key: string) => {
    setDemoLoading(key);
    setError("");
    login(
      { email, password },
      {
        onSuccess: finishLogin,
        onError: (err) => setError(loginErrorMessage(err)),
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
      <div className="text-center">
        <h1 className="text-2xl font-bold">Welcome back</h1>
        <p className="text-sm text-muted-foreground">Sign in to your account to continue.</p>
      </div>

      <form
        noValidate
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
                <FieldLabel>Email address</FieldLabel>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="email"
                    autoComplete="email"
                    placeholder="ahmed@example.com"
                    className="pl-8"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                  />
                </div>
                <FieldError errors={field.state.meta.errors} />
              </Field>
            )}
          </form.Field>
          <form.Field name="password">
            {(field) => (
              <Field>
                <div className="flex items-center justify-between">
                  <FieldLabel>Password</FieldLabel>
                  <Link href="/forgot-password" className="text-xs text-primary hover:underline">Forgot password?</Link>
                </div>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    className="px-8"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword((v) => !v)}
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
                <FieldError errors={field.state.meta.errors} />
              </Field>
            )}
          </form.Field>
        </FieldGroup>

        {error && (
          <div role="alert" className="flex items-start gap-2 rounded-lg bg-destructive/10 px-3 py-2.5 text-sm font-medium text-destructive">
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <Button type="submit" className="w-full" size="lg" disabled={isPending || demoLoading !== null}>
          {isPending && demoLoading === "form" ? "Signing in..." : "Sign In"}
        </Button>
      </form>

      {googleClientId && (
        <>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
          </div>
          <GoogleSignIn onCredential={(token) => { setError(""); doGoogleLogin(token); }} text="continue_with" />
        </>
      )}

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account? <Link href="/register" className="font-semibold text-primary">Register for free</Link>
      </p>

      <div className="rounded-xl border bg-muted/30 p-4">
        <h2 className="mb-3 text-center text-sm font-semibold">🚀 Quick demo login</h2>
        <div className="grid grid-cols-3 gap-3">
          {DEMO_ACCOUNTS.map((d) => (
            <div key={d.role} className="flex flex-col items-center gap-2 rounded-lg border bg-background p-3">
              <span className="text-2xl">{d.icon}</span>
              <span className="text-sm font-medium">{d.role}</span>
              <Button size="sm" variant="outline" disabled={demoLoading !== null} onClick={() => doLogin(d.email, d.password, d.role)}>
                {demoLoading === d.role ? "..." : "Demo Login"}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
