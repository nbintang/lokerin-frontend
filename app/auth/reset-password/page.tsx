"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { useActionState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AuthCard } from "@/features/auth/components/AuthCard"
import { Loader2, CheckCircle } from "lucide-react"

export default function ResetPasswordPage() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token") || ""
  const [state, formAction, isPending] = useActionState(resetPassword, { error: null, success: false, message: "" })

  if (!token) {
    return (
      <AuthCard title="Invalid Reset Link">
        <div className="text-center space-y-4">
          <p className="text-red-600">This password reset link is invalid or has expired.</p>
          <Button asChild>
            <Link href="/auth/forgot-password">Request new reset link</Link>
          </Button>
        </div>
      </AuthCard>
    )
  }

  if (state?.success) {
    return (
      <AuthCard title="Password Reset Successful">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center w-12 h-12 mx-auto bg-green-100 rounded-full">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <p className="text-green-600">{state.message}</p>
          <Button asChild className="w-full">
            <Link href="/auth/signin">Continue to sign in</Link>
          </Button>
        </div>
      </AuthCard>
    )
  }

  return (
    <AuthCard title="Reset your password" description="Enter your new password below">
      <form action={formAction} className="space-y-4">
        <input type="hidden" name="token" value={token} />

        <div className="space-y-2">
          <Label htmlFor="password">New Password</Label>
          <Input id="password" name="password" type="password" placeholder="••••••••" required disabled={isPending} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm New Password</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="••••••••"
            required
            disabled={isPending}
          />
        </div>

        {state?.error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{state.error}</div>}

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Resetting password...
            </>
          ) : (
            "Reset password"
          )}
        </Button>
      </form>

      <div className="mt-4 text-center">
        <Link href="/auth/signin" className="text-sm text-blue-600 hover:underline">
          Back to sign in
        </Link>
      </div>
    </AuthCard>
  )
}
