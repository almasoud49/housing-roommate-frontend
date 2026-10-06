"use client";

import { useForm } from "@tanstack/react-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { registerSchema, verifyAccountSchema } from "@/validation";
import { useState } from "react";
import { useRegistration, useVerifyAccount } from "@/hooks";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { getErrorMessage } from "@/lib/apiClient";

export default function RegisterForm() {
  const router = useRouter();
  const { mutate: register, isPending } = useRegistration();
  const [emailForVerify, setEmailForVerify] = useState<string | null>(null);

  const form = useForm({
    defaultValues: { name: "", email: "", password: "", role: "TENANT" as "TENANT" | "LANDLORD" | "PROPERTY_MANAGER" },
    validators: { onSubmit: registerSchema },
    onSubmit: ({ value }) => {
      register(value, {
        onSuccess: () => {
          toast.success("Registration successful! Check your email for the OTP.");
          setEmailForVerify(value.email);
        },
        onError: (err) => toast.error(getErrorMessage(err)),
      });
    },
  });

  if (emailForVerify) {
    return <VerifyForm email={emailForVerify} onDone={() => router.push("/login")} />;
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-4">
      <form
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
                <Input value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} onBlur={field.handleBlur} />
                <FieldError errors={field.state.meta.errors} />
              </Field>
            )}
          </form.Field>
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
          <form.Field name="role">
            {(field) => (
              <Field>
                <FieldLabel>I am a...</FieldLabel>
                <select
                  className="h-9 w-full rounded-md border px-3 text-sm"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value as typeof field.state.value)}
                >
                  <option value="TENANT">Tenant</option>
                  <option value="LANDLORD">Landlord</option>
                  <option value="PROPERTY_MANAGER">Property Manager</option>
                </select>
              </Field>
            )}
          </form.Field>
        </FieldGroup>
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Creating..." : "Register"}
        </Button>
      </form>
      <p className="text-center text-sm text-muted-foreground">
        Already have an account? <Link href="/login" className="text-primary">Login</Link>
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
    <div className="mx-auto w-full max-w-md space-y-4">
      <h2 className="text-center text-xl font-bold">Verify your email</h2>
      <p className="text-center text-sm text-muted-foreground">We sent an OTP to {email}</p>
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
              <FieldLabel>OTP</FieldLabel>
              <Input value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} onBlur={field.handleBlur} />
              <FieldError errors={field.state.meta.errors} />
            </Field>
          )}
        </form.Field>
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Verifying..." : "Verify Email"}
        </Button>
      </form>
    </div>
  );
}
