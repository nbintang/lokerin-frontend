 
import Link from "next/link";
import { AuthCard } from "@/features/auth/components/AuthCard";
import ForgotPasswordForm from "@/features/auth/forgot-password";
import { Button } from "@/components/ui/button";

export default function ForgotPasswordPage() {
  return (
    <AuthCard
      title="Forgot Password"
      description="Enter your email address and we'll send you a link to reset your password."
    >
      <ForgotPasswordForm />
      <Button className="grid place-items-center mt-4" variant={"link"} asChild>
        <Link href="/auth/signin">Back to sign in</Link>
      </Button>
    </AuthCard>
  );
}
