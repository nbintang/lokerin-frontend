"use client"

import Link from "next/link"
import { useActionState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AuthCard } from "@/components/auth/AuthCard"
import { forgotPassword } from "@/app/actions/auth"
import { ArrowLeft, Loader2, Mail } from "lucide-react"

export default function ForgotPasswordPage() {
  const [state, formAction, isPending] = useActionState(forgotPassword, { error: null, success: false, message: "" })

  return (
    <AuthCard
      title="Forgot your password?"
      description="Enter your email address and we'll send you a link to reset your password"
    >
      <form action={formAction} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>
          <Input id="email" name="email" type="email" placeholder="john@example.com" required disabled={isPending} />
        </div>

        {state?.error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{state.error}</div>}

        {state?.success && (
          <div className="text-sm text-green-600 bg-green-50 p-3 rounded-md flex items-center">
            <Mail className="w-4 h-4 mr-2" />
            {state.message}
          </div>
        )}

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            "Send reset instructions"
          )}
        </Button>
      </form>

      <div className="mt-4 text-center">
        <Link href="/auth/signin" className="inline-flex items-center text-sm text-blue-600 hover:underline">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to sign in
        </Link>
      </div>
    </AuthCard>
  )
}
