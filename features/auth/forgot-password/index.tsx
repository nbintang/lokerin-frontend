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
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangleIcon, Loader2, Mail } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import useTimerCountDown from "@/hooks/useTImerCountDown";
import useHandleLoadingDialog from "@/hooks/useHandleVerifyDialog";
import { useMutation } from "@tanstack/react-query";
import { lokerinAPI } from "@/shared-api/config/api";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});
type ForgotPassword = z.infer<typeof forgotPasswordSchema>;

    const forgotPassword = async (data: ForgotPassword) => {
    return await lokerinAPI.post<{ message: string }>("/auth/forgot-password",data );
    };

export default function ForgotPasswordForm() {
  const { startTimer, timer, isTimerStarted } = useTimerCountDown();

  const setOpenDialog = useHandleLoadingDialog((state) => state.setOpenDialog);
  const form = useForm<ForgotPassword>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });
  const { isSuccess, isError, mutate, isPending, error } = useMutation({
    mutationKey: ["forgot-password"],
    mutationFn: forgotPassword,
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
        description: "Email sent successfully",
        isLoading: false,
        isError: false,
        isSuccess: true,
      });
    },
    onError: (error) => {
      setOpenDialog("forgot", {
        description: "Failed to send email",
        isLoading: false,
        isError: true,
        isSuccess: false,
      });
      if (isAxiosError(error)) {
        toast.error(error.response?.data.message ?? "Failed to send email");
      } else toast.error("An unexpected error occurred");
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(
          (values) => (mutate(values), isSuccess && form.reset())
        )}
        className="flex w-full md:w-auto gap-2 space-y-4 flex-col"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <div className="flex justify-between items-center">
                <FormLabel htmlFor="email">Email address</FormLabel>
                <span className="text-xs text-muted-foreground">
                  {isTimerStarted && `Resend in ${timer} seconds`}
                </span>
              </div>
              <FormControl>
                <Input
                  placeholder="Your email address"
                  className="bg-white"
                  disabled={isPending || isTimerStarted || isSuccess}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {isSuccess && (
          <div className="text-xs text-green-600 bg-green-50 p-3 rounded-md flex items-center">
            <Mail className="w-4 h-4 mr-2" />
            Your password reset link has been sent to your email, please check.
          </div>
        )}
        {isError && (
          <div className="flex items-center gap-x-2 bg-red-50 p-3 rounded-md">
            <AlertTriangleIcon className="text-red-600" />
            <div className="text-sm text-red-600  ">{error.message}</div>
          </div>
        )}
        <Button
          type="submit"
          className="w-full"
          disabled={isPending || isTimerStarted || isSuccess}
        >
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
    </Form>
  );
}
