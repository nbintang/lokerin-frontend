"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthCard } from "@/features/auth/components/AuthCard"; 
import { Mail, CheckCircle, Loader2, RefreshCw } from "lucide-react";
import { lokerinAPI } from "@/shared-api/config/api";
import { useMutation } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { useProgress } from "@bprogress/next";
import { jwtDecode } from "@/shared-api/helpers/jwtDecode";
import ResendEmailForm from "@/features/auth/verify/ResendEmailForm";
const verifyToken = async (token: string) =>
  await lokerinAPI.post<{ accessToken: string }>(`/auth/verify`, undefined, {
    params: {
      token,
    },
  });
export default function VerifyPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const router = useRouter();
  const progress = useProgress();
  const { mutate, isPending, isSuccess } = useMutation({
    mutationKey: ["verify-user"],
    mutationFn: async () => {
      const response = await verifyToken(token);
      return response;
    },
    onMutate: () => {
      toast.loading("Verifying email...", { id: "verify" });
    },
    onSuccess: (res) => {
      Cookies.set("accessToken", res.data.accessToken);
      const tokenInfo = jwtDecode(res.data.accessToken);
      const role = tokenInfo.role;
      progress.start();
      if (role === "ADMINISTRATOR" || role === "RECRUITER") {
        router.push(`/${role.toLowerCase()}/dashboard`);
      } else router.push("/applier/dashboard");
      return res;
    },
    onError: (err) => {
      if (isAxiosError(err)) {
        toast.error(err.response?.data.message ?? "Failed to verify email", {
          id: "verify",
        });
      }
    },
    retry: false,
  });
  useEffect(() => {
    if (token) mutate();
  }, [token, mutate]);
  // // If verification was successful
  // if (verificationState === "success") {
  //   return (
  //     <AuthCard title="Email Verified Successfully!">
  //       <div className="text-center space-y-4">
  //         <div className="flex items-center justify-center w-16 h-16 mx-auto bg-green-100 rounded-full">
  //           <CheckCircle className="w-8 h-8 text-green-600" />
  //         </div>
  //         <p className="text-green-600">
  //           Your email has been verified successfully!
  //         </p>
  //         <Button asChild className="w-full">
  //           <Link href="/auth/signin">Continue to sign in</Link>
  //         </Button>
  //       </div>
  //     </AuthCard>
  //   );
  // }

  // Default verification page
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
          Didn't receive the email? Check your spam folder or request a new
          verification email.
        </p>
        <Button
          className="grid place-items-center "
          variant={"link"}
          asChild
        >
          <Link href="/auth/signin" >
            Back to sign in
          </Link>
        </Button>
      </div>
    </AuthCard>
  );
}
