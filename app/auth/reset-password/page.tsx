import Link from "next/link";
import { AuthCard } from "@/features/auth/components/AuthCard";
import ResetPasswordForm from "@/features/auth/reset-password";
import { Button } from "@/components/ui/button";

export default function ResetPasswordPage() {
  return (
    <AuthCard
      title="Reset your password"
      description="Enter your new password below"
    >
      <ResetPasswordForm />
      <Button className="grid place-items-center  mt-4" variant={"link"} asChild>
        <Link href="/auth/signin">Back to sign in</Link>
      </Button>
    </AuthCard>
  );
}
