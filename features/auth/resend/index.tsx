"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { AlertTriangleIcon, Loader2, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import useTimerCountDown from "@/hooks/useTImerCountDown";
import useHandleLoadingDialog from "@/hooks/useHandleVerifyDialog";
import { useMutation } from "@tanstack/react-query";
import { lokerinAPI } from "@/shared-api/config/api";
import { isAxiosError } from "axios";
import { toast } from "sonner";

const resendEmailSchema = z.object({
  email: z.email({ message: "Invalid email" }),
});
type ResendEmail = z.infer<typeof resendEmailSchema>;
const resendEmail = async (email: ResendEmail) => {
  return await lokerinAPI.post<{ message: string }>(
    "/auth/resend-verification",
    { email }
  );
};
export default function ResendEmailForm({
  isVerifying,
  isSuccessVerifying,
}: {
  isVerifying?: boolean;
  isSuccessVerifying?: boolean;
}) {
  const { startTimer, timer, isTimerStarted } = useTimerCountDown();
  const setOpenDialog = useHandleLoadingDialog((state) => state.setOpenDialog);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);

  const form = useForm<ResendEmail>({
    resolver: zodResolver(resendEmailSchema),
    defaultValues: {
      email: "",
    },
  });

  const { isSuccess, isError, mutate } = useMutation({
    mutationKey: ["resend-email"],
    mutationFn: resendEmail,
    onMutate: (res) => {
      setOpenDialog("resend", {
        description: "Verifying your data...",
        isLoading: true,
        isError: false,
        isSuccess: false,
      });
      startTimer(120);
    },
    onSuccess: (res) => {
      setOpenDialog("resend", {
        description: "Email sent successfully",
        isLoading: false,
        isError: false,
        isSuccess: true,
      });
    },
    onError: (error) => {
      setOpenDialog("resend", {
        description: "Failed to resend email",
        isLoading: false,
        isError: true,
        isSuccess: false,
      });
      if (isAxiosError(error)) {
        toast.error(error.response?.data.message ?? "Failed to resend email");
      } else toast.error("An unexpected error occurred");
    },
  });
  const isDisabled = isTimerStarted || isVerifying || isSuccessVerifying;
  useEffect(() => {
    if ((form.formState.isSubmitSuccessful && isSuccess) || isError) {
      setShowSuccess(true);
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [form.formState.isSubmitSuccessful]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(
          (values) => (mutate(values), isSuccess && form.reset())
        )}
        className="space-y-4"
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
                  id="email"
                  placeholder="john@example.com"
                  disabled={isDisabled}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {showSuccess && (
          <div className="text-sm text-green-600 bg-green-50 p-3 rounded-md">
            A verification email has been sent to your email address.
          </div>
        )}

        {isError && (
          <div className="flex items-center gap-x-2 bg-red-50 p-3 rounded-md">
            <AlertTriangleIcon className="text-red-600" />
            <div className="text-sm text-red-600  ">Something went wrong</div>
          </div>
        )}
        <Button
          type="submit"
          variant="outline"
          className="w-full"
          disabled={isDisabled || !form.formState.isDirty}
        >
          {isTimerStarted ? (
            <>
              <Loader2
                className={cn(
                  "mr-2 h-4 w-4 ",
                  isTimerStarted && "animate-spin"
                )}
              />
             Please wait till the timer ends
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Resend verification email
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
