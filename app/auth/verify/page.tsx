"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { useActionState, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AuthCard } from "@/features/auth/components/AuthCard"
import { resendVerification, verifyEmail } from "@/app/actions/auth"
import { Mail, CheckCircle, Loader2, RefreshCw } from "lucide-react"

export default function VerifyPage() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const [verificationState, setVerificationState] = useState<"pending" | "success" | "error">("pending")
  const [resendState, resendAction, isResending] = useActionState(resendVerification, {
    error: null,
    success: false,
    message: "",
  })

  useEffect(() => {
    if (token) {
      // Auto-verify if token is present in URL
      verifyEmail(token).then((result) => {
        if (result.success) {
          setVerificationState("success")
        } else {
          setVerificationState("error")
        }
      })
    }
  }, [token])

  // If verification was successful
  if (verificationState === "success") {
    return (
      <AuthCard title="Email Verified Successfully!">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center w-16 h-16 mx-auto bg-green-100 rounded-full">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <p className="text-green-600">Your email has been verified successfully!</p>
          <Button asChild className="w-full">
            <Link href="/auth/signin">Continue to sign in</Link>
          </Button>
        </div>
      </AuthCard>
    )
  }

  // Default verification page
  return (
    <AuthCard
      title="Verify your email"
      description="We've sent a verification link to your email address. Please check your inbox and click the link to verify your account."
    >
      <div className="space-y-6">
        <div className="text-center">
          <div className="flex items-center justify-center w-16 h-16 mx-auto bg-blue-100 rounded-full mb-4">
            <Mail className="w-8 h-8 text-blue-600" />
          </div>
          <p className="text-sm text-gray-600 mb-4">
            {"Didn't receive the email? Check your spam folder or request a new verification email."}
          </p>
        </div>

        <form action={resendAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="john@example.com"
              required
              disabled={isResending}
            />
          </div>

          {resendState?.error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{resendState.error}</div>
          )}

          {resendState?.success && (
            <div className="text-sm text-green-600 bg-green-50 p-3 rounded-md">{resendState.message}</div>
          )}

          <Button type="submit" variant="outline" className="w-full" disabled={isResending}>
            {isResending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Resend verification email
              </>
            )}
          </Button>
        </form>

        <div className="text-center">
          <Link href="/auth/signin" className="text-sm text-blue-600 hover:underline">
            Back to sign in
          </Link>
        </div>
      </div>
    </AuthCard>
  )
}
