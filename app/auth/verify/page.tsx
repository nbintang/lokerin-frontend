"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AuthCard } from "@/features/auth/components/AuthCard";
import { Mail } from "lucide-react";
import { lokerinAPI } from "@/shared-api/config/api";
import { useMutation } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { useProgress } from "@bprogress/next";
import { jwtDecode } from "@/shared-api/helpers/jwtDecode";
import ResendEmailForm from "@/features/auth/resend";
const verifyToken = async (token: string) =>
  await lokerinAPI.post<{ message: string; data: { accessToken: string } }>(
    `/auth/verify`,
    null,
    {
      params: {
        token,
      },
    }
  );
export default function VerifyPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const router = useRouter();
  const progress = useProgress();
  const { mutate, isPending, isSuccess } = useMutation({
    mutationKey: ["verify-user"],
    mutationFn: async () => {
      progress.start();
      const response = await verifyToken(token);
      console.log(response);
      Cookies.set("accessToken", response.data.data.accessToken);
      const tokenInfo = jwtDecode(response.data.data.accessToken);
      return tokenInfo;
    },
    onMutate: () => {
      toast.loading("Verifying email...", { id: "verify" });
    },
    onSuccess: (tokenInfo) => {
      const role = tokenInfo.role;

      if (role === "ADMINISTRATOR" || role === "RECRUITER") {
        router.push(`/${role.toLowerCase()}/dashboard`);
      } else router.push("/applier/dashboard");
      toast.success("Email verified successfully", { id: "verify" });
      return tokenInfo;
    },
    onError: (err) => {
      if (isAxiosError(err)) {
        toast.error(err.response?.data.message ?? "Failed to verify email", {
          id: "verify",
        });
      }
    },
    onSettled: () => {
      progress.stop();
      toast.dismiss("verify");
    },
    retry: false,
  });
  useEffect(() => {
    if (token) mutate();
  }, [token, mutate]);
  return (
    <AuthCard
      title="Verify your email"
      description="We've sent a verification link to your email address. Please check your inbox and click the link to verify your account."
    >
      <div className="space-y-6">
        <div className="text-center">
          <div className="flex items-center justify-center w-16 h-16 mx-auto bg-border rounded-full mb-4">
            <Mail className="w-8 h-8  " />
          </div>
        </div>
        <ResendEmailForm
          isVerifying={isPending}
          isSuccessVerifying={isSuccess}
        />
        <p className="text-xs text-center text-muted-foreground mb-4">
          Didn&apos;t receive the email? Check your spam folder or request a new
          verification email.
        </p>
        <Button className="grid place-items-center " variant={"link"} asChild>
          <Link href="/auth/signin">Back to sign in</Link>
        </Button>
      </div>
    </AuthCard>
  );
}
