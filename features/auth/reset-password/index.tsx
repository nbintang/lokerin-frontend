"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useHandleLoadingDialog from "@/hooks/useHandleVerifyDialog";
import useTimerCountDown from "@/hooks/useTImerCountDown";
import { lokerinAPI } from "@/shared-api/config/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { AlertTriangleIcon, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export const BaseResetPasswordSchema = z.object({
  newPassword: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." }),
  confirmPassword: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." }),
});

export const ResetPasswordSchema = BaseResetPasswordSchema.refine(
  (data) => data.newPassword === data.confirmPassword,
  {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  }
);

export type ResetPasswordSchemaType = z.infer<typeof ResetPasswordSchema>;
export const ResetPasswordAPISchema = BaseResetPasswordSchema.pick({
  newPassword: true,
});
const resetPassword = async (
  data: z.infer<typeof ResetPasswordAPISchema>,
  token: string
) => {
  return await lokerinAPI.post<{ message: string }>(
    "/auth/reset-password",
    data,
    {
      params: {
        token,
      },
    }
  );
};

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") as string;
  const { startTimer } = useTimerCountDown();
    const router = useRouter()
  const setOpenDialog = useHandleLoadingDialog((state) => state.setOpenDialog);
  const form = useForm<ResetPasswordSchemaType>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });
  const { isSuccess, isError, mutate, isPending, error } = useMutation({
    mutationKey: ["reset-password"],
    mutationFn: async (v: z.infer<typeof ResetPasswordAPISchema>) =>
      await resetPassword(v, token),
    onMutate: (res) => {
      setOpenDialog("forgot", {
        description: "Verifying your data...",
        isLoading: true,
        isError: false,
        isSuccess: false,
      });
      startTimer(120);
    },
    onSuccess: (res) => {
      setOpenDialog("forgot", {
        description: "Password reset successfully",
        isLoading: false,
        isError: false,
        isSuccess: true,
      });
      router.push("/auth/signin");
    },
    onError: (error) => {
      setOpenDialog("forgot", {
        description: "Failed to reset password",
        isLoading: false,
        isError: true,
        isSuccess: false,
      });
      if (isAxiosError(error)) {
        toast.error(error.response?.data.message ?? "Failed to  reset password");
      } else toast.error("An unexpected error occurred");
    },
  });
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(
          ({ newPassword }) => (mutate({ newPassword }), form.reset())
        )}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel htmlFor="password">New Password</FormLabel>
              <FormControl>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="••••••••"
                  disabled={isSuccess || isPending || !token}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel htmlFor="Confirm your password">
                Confirm Password
              </FormLabel>
              <FormControl>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  disabled={isSuccess || isPending || !token}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {isError && (
          <div className="flex items-center gap-x-2 bg-red-50 p-3 rounded-md">
            <AlertTriangleIcon className="text-red-600" />
            <div className="text-sm text-red-600  ">{error.message}</div>
          </div>
        )}
        <Button
          type="submit"
          className="w-full"
          disabled={isSuccess || isPending || !token}
        >
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
    </Form>
  );
}
