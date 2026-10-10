"use client";

import { useForm } from "@tanstack/react-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { registerFormSchema, verifyAccountSchema } from "@/validation";
import { useState, type ComponentType } from "react";
import { useRegistration, useVerifyAccount } from "@/hooks";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { Briefcase, Building2, Check, Circle, User } from "lucide-react";
import { cn } from "cn";
import { getErrorMessage } from "@/lib/apiClient";
import GoogleSignIn, { googleClientId } from "./google-sign-in";
import { useGoogleSession } from "./use-finish-login";

type Role = "TENANT" | "LANDLORD" | "PROPERTY_MANAGER";

const ROLES: { value: Role; title: string; description: string; icon: ComponentType<{ className?: string }> }[] = [
  { value: "TENANT", title: "Tenant", description: "Find a room, apply, split bills and match with roommates.", icon: User },
  { value: "LANDLORD", title: "Landlord", description: "List properties, review applications and collect rent.", icon: Building2 },
  { value: "PROPERTY_MANAGER", title: "Property Manager", description: "Manage listings, viewings and maintenance for owners.", icon: Briefcase },
];

const STEPS = ["Role", "Account", "Verify"] as const;

function StepIndicator({ current }: { current: number }) {
  return (
    <ol className="mb-6 flex items-center justify-center gap-2 text-sm">
      {STEPS.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={label} className="flex items-center gap-2">
            <span
              className={cn(
                "flex size-6 items-center justify-center rounded-full text-xs font-semibold",
                done && "bg-primary text-primary-foreground",
                active && "bg-primary text-primary-foreground ring-4 ring-primary/20",
                !done && !active && "bg-muted text-muted-foreground",
              )}
            >
              {done ? <Check className="size-3.5" /> : i + 1}
            </span>
            <span className={cn(active ? "font-medium" : "text-muted-foreground")}>{label}</span>
            {i < STEPS.length - 1 && <span className="mx-1 h-px w-6 bg-border" />}
          </li>
        );
      })}
    </ol>
  );
}

const PASSWORD_RULES = [
  { label: "At least 6 characters", test: (p: string) => p.length >= 6 },
  { label: "A lowercase letter", test: (p: string) => /[a-z]/.test(p) },
  { label: "An uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { label: "A number", test: (p: string) => /[0-9]/.test(p) },
];

function PasswordChecklist({ value }: { value: string }) {
  return (
    <ul className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
      {PASSWORD_RULES.map((r) => {
        const ok = r.test(value);
        return (
          <li key={r.label} className={cn("flex items-center gap-1.5", ok ? "text-green-600 dark:text-green-400" : "text-muted-foreground")}>
            {ok ? <Check className="size-3" /> : <Circle className="size-3" />}
            {r.label}
          </li>
        );
      })}
    </ul>
  );
}

export default function RegisterForm() {
  const router = useRouter();
  const { mutate: register, isPending } = useRegistration();
  const doGoogleLogin = useGoogleSession();
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [emailForVerify, setEmailForVerify] = useState<string | null>(null);

  const form = useForm({
    defaultValues: { name: "", email: "", password: "", confirmPassword: "", role: "TENANT" as Role },
    validators: { onSubmit: registerFormSchema },
    onSubmit: ({ value }) => {
      const { confirmPassword: _ignored, ...payload } = value;
      void _ignored;
      register(payload, {
        onSuccess: () => {
          toast.success("Registration successful! Check your email for the OTP.");
          setEmailForVerify(value.email);
          setStep(2);
        },
        onError: (err) => toast.error(getErrorMessage(err)),
      });
    },
  });

  if (step === 2 && emailForVerify) {
    return (
      <div className="mx-auto w-full max-w-md">
        <StepIndicator current={2} />
        <VerifyForm email={emailForVerify} onDone={() => router.push("/login")} />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-4">
      <StepIndicator current={step} />

      {step === 0 && (
        <div className="space-y-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Create your account</h1>
            <p className="text-sm text-muted-foreground">First, tell us how you&apos;ll use the platform.</p>
          </div>
          <form.Field name="role">
            {(field) => (
              <div role="radiogroup" aria-label="I am a..." className="space-y-3">
                {ROLES.map((r) => {
                  const selected = field.state.value === r.value;
                  return (
                    <button
                      key={r.value}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => field.handleChange(r.value)}
                      className={cn(
                        "flex w-full items-start gap-3 rounded-xl border p-4 text-left transition-colors hover:bg-muted/50",
                        selected && "border-primary bg-primary/5 ring-2 ring-primary/20",
                      )}
                    >
                      <span className={cn("mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg", selected ? "bg-primary text-primary-foreground" : "bg-muted")}>
                        <r.icon className="size-5" />
                      </span>
                      <span className="flex-1">
                        <span className="block font-medium">{r.title}</span>
                        <span className="block text-sm text-muted-foreground">{r.description}</span>
                      </span>
                      {selected && <Check className="mt-1 size-5 text-primary" />}
                    </button>
                  );
                })}
              </div>
            )}
          </form.Field>
          <Button className="w-full" onClick={() => setStep(1)}>Continue</Button>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-4">
          <form.Subscribe selector={(s) => s.values.role}>
            {(role) => (
              <>
                <div className="text-center">
                  <h1 className="text-2xl font-bold">Your account details</h1>
                  <p className="text-sm text-muted-foreground">
                    Registering as <span className="font-medium text-foreground">{ROLES.find((r) => r.value === role)?.title}</span>{" "}
                    <button type="button" className="text-primary underline" onClick={() => setStep(0)}>Change</button>
                  </p>
                </div>

                {googleClientId && (
                  role === "TENANT" ? (
                    <>
                      <GoogleSignIn onCredential={doGoogleLogin} text="signup_with" />
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="h-px flex-1 bg-border" /> or use your email <span className="h-px flex-1 bg-border" />
                      </div>
                    </>
                  ) : (
                    <p className="rounded-lg border border-dashed p-3 text-center text-xs text-muted-foreground">
                      Google sign-up creates a tenant account. Use your email to register as a {ROLES.find((r) => r.value === role)?.title.toLowerCase()}.
                    </p>
                  )
                )}
              </>
            )}
          </form.Subscribe>

          <form
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
            className="space-y-4"
          >
            <FieldGroup>
              <form.Field name="name">
                {(field) => (
                  <Field>
                    <FieldLabel>Full name</FieldLabel>
                    <Input autoComplete="name" placeholder="e.g. Ahmed Rahman" value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} onBlur={field.handleBlur} />
                    <FieldError errors={field.state.meta.errors} />
                  </Field>
                )}
              </form.Field>
              <form.Field name="email">
                {(field) => (
                  <Field>
                    <FieldLabel>Email address</FieldLabel>
                    <Input type="email" autoComplete="email" placeholder="your@email.com" value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} onBlur={field.handleBlur} />
                    <FieldError errors={field.state.meta.errors} />
                  </Field>
                )}
              </form.Field>
              <form.Field name="password">
                {(field) => (
                  <Field>
                    <FieldLabel>Password</FieldLabel>
                    <Input type="password" autoComplete="new-password" placeholder="Minimum 6 characters" value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} onBlur={field.handleBlur} />
                    <PasswordChecklist value={field.state.value} />
                    <FieldError errors={field.state.meta.errors} />
                  </Field>
                )}
              </form.Field>
              <form.Field name="confirmPassword">
                {(field) => (
                  <Field>
                    <FieldLabel>Confirm password</FieldLabel>
                    <Input type="password" autoComplete="new-password" placeholder="Repeat your password" value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} onBlur={field.handleBlur} />
                    <FieldError errors={field.state.meta.errors} />
                  </Field>
                )}
              </form.Field>
            </FieldGroup>
            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={() => setStep(0)}>Back</Button>
              <Button type="submit" className="flex-1" disabled={isPending}>
                {isPending ? "Creating account..." : "Create account"}
              </Button>
            </div>
          </form>
        </div>
      )}

      <p className="text-center text-sm text-muted-foreground">
        Already have an account? <Link href="/login" className="text-primary">Sign in</Link>
      </p>
    </div>
  );
}

function VerifyForm({ email, onDone }: { email: string; onDone: () => void }) {
  const { mutate: verify, isPending } = useVerifyAccount();
  const form = useForm({
    defaultValues: { email, otp: "" },
    validators: { onSubmit: verifyAccountSchema },
    onSubmit: ({ value }) => {
      verify(value, {
        onSuccess: () => {
          toast.success("Email verified! You can now log in.");
          onDone();
        },
        onError: (err) => toast.error(getErrorMessage(err)),
      });
    },
  });

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Verify your email</h1>
        <p className="text-sm text-muted-foreground">We sent a 6-digit code to <span className="font-medium text-foreground">{email}</span></p>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="space-y-4"
      >
        <form.Field name="otp">
          {(field) => (
            <Field>
              <FieldLabel>Verification code</FieldLabel>
              <Input
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                placeholder="000000"
                className="text-center text-lg tracking-[0.5em]"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value.replace(/\D/g, ""))}
                onBlur={field.handleBlur}
              />
              <FieldError errors={field.state.meta.errors} />
            </Field>
          )}
        </form.Field>
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Verifying..." : "Verify email"}
        </Button>
      </form>
    </div>
  );
}
