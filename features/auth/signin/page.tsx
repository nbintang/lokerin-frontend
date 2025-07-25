"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import Link from "next/link";
import { LoaderCircleIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { jwtDecode } from "@/lib/jwtDecode";
import { useProgress } from "@bprogress/next";
import z from "zod";
import { lokerinApi } from "@/lib/axiosConfig";
import { isAxiosError } from "axios";
import { useAuthStore } from "@/shared-api/stores/useAuthStore";
const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
type SignInForm = z.infer<typeof signInSchema>;
const postSignin = async (values: SignInForm) =>
  await lokerinApi.post<{ accessToken: string }>(`/auth/signin`, values);

export default function SignInForm() {
  const form = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const router = useRouter();
  const loader = useProgress();
  const onSubmit = async (values: SignInForm) =>
    toast.promise(postSignin(values), {
      loading: "Signing in...",
      success: (res) => {
        useAuthStore.getState().setToken(res.data.accessToken);
        const tokenInfo = jwtDecode(res.data.accessToken);
        const role = tokenInfo.role;
        loader.start();
        if (role === "ADMINISTRATOR" || role === "RECRUITER") {
          router.push(`/${role.toLowerCase()}/dashboard`);
        } else router.push("/");
        return "Signed in successfully";
      },
      error: (err) => {
        if (isAxiosError(err) && err.response?.status === 401)
          return "Invalid email or password";
      },
      finally: () => {
        loader.stop();
        form.reset();
      },
      richColors: true,
    });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="grid gap-3">
              <FormLabel htmlFor="email">Email</FormLabel>
              <FormControl>
                <Input
                  id="email"
                  placeholder="m@example.com"
                  type="email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="grid gap-3">
              <div className="flex items-center">
                <FormLabel htmlFor="password">Password</FormLabel>
                <Link
                  href="/auth/forgot-password"
                  className="ml-auto text-sm underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </Link>
              </div>
              <FormControl>
                <Input
                  id="password"
                  placeholder="********"
                  type="password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full"
          disabled={form.formState.isSubmitting}
        >
          {!form.formState.isSubmitting ? (
            "Sign in"
          ) : (
            <span className="flex items-center gap-2">
              Signing in
              <LoaderCircleIcon className="animate-spin" />
            </span>
          )}
        </Button>
      </form>
    </Form>
  );
}
