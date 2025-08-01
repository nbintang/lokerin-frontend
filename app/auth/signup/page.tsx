import SignUpForm from "@/features/auth/signup";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold"> Register to your account</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your data below to register to your account
        </p>
      </div>
      <SignUpForm />
      <div className="text-center text-sm">
        Already have an account?{" "}
        <Link href="/auth/signin" className="underline underline-offset-4">
          Sign in
        </Link>
      </div>
    </div>
  );
}
