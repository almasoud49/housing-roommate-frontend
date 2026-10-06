import ForgotPasswordForm from "@/components/form/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <div className="mx-auto flex min-h-svh max-w-md flex-col items-center justify-center gap-6 px-4">
      <h1 className="text-2xl font-bold">Reset your password</h1>
      <ForgotPasswordForm />
    </div>
  );
}
