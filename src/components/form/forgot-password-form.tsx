"use client";

import { useForm } from "@tanstack/react-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { forgotPasswordSchema, resetPasswordSchema } from "@/validation";
import { useState } from "react";
import { useForgotPassword, useResetPassword } from "@/hooks";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/apiClient";

export default function ForgotPasswordForm() {
  const router = useRouter();
  const { mutate: send, isPending } = useForgotPassword();
  const [email, setEmail] = useState<string | null>(null);

  const form = useForm({
    defaultValues: { email: "" },
    validators: { onSubmit: forgotPasswordSchema },
    onSubmit: ({ value }) => {
      send(value, {
        onSuccess: () => {
          toast.success("If the email exists, an OTP has been sent.");
          setEmail(value.email);
        },
        onError: (err) => toast.error(getErrorMessage(err)),
      });
    },
  });

  if (email) return <ResetForm email={email} onDone={() => router.push("/login")} />;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="w-full max-w-md space-y-4"
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
      </FieldGroup>
      <Button type="submit" className="w-full" disabled={isPending}>Send Reset OTP</Button>
    </form>
  );
}

function ResetForm({ email, onDone }: { email: string; onDone: () => void }) {
  const { mutate: reset, isPending } = useResetPassword();
  const form = useForm({
    defaultValues: { email, otp: "", newPassword: "" },
    validators: { onSubmit: resetPasswordSchema },
    onSubmit: ({ value }) => {
      reset(value, {
        onSuccess: () => {
          toast.success("Password reset! Please log in.");
          onDone();
        },
        onError: (err) => toast.error(getErrorMessage(err)),
      });
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="w-full max-w-md space-y-4"
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
      <form.Field name="newPassword">
        {(field) => (
          <Field>
            <FieldLabel>New password</FieldLabel>
            <Input type="password" value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} onBlur={field.handleBlur} />
            <FieldError errors={field.state.meta.errors} />
          </Field>
        )}
      </form.Field>
      <Button type="submit" className="w-full" disabled={isPending}>Reset Password</Button>
    </form>
  );
}
