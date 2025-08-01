"use client";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  ChevronsLeft,
  ChevronsRight,
  LoaderCircleIcon,
  LogInIcon,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { defineStepper } from "@stepperize/react";
import { mediaSchema, recruiterSchema, userSchema } from "./schema";
import UserForm from "./components/UserForm";
import RecruiterForm from "./components/RecruiterForm";
import AvatarForm from "./components/AvatarForm";
import ResumeForm from "./components/ResumeForm";
import RoleForm from "./components/RoleForm";
import { cn } from "@/lib/utils";
import useUploadImage from "@/shared-api/hooks/media/useUploadImages";

export const signUpStepper = defineStepper(
  { id: "user", label: "User", schema: userSchema },
  {
    id: "recruiter",
    label: "Recruiter",
    schema: recruiterSchema,
  },
  { id: "media", label: "Media", schema: mediaSchema }
);

export default function SignUpForm() {
  const stepper = signUpStepper.useStepper();
  const form = useForm({
    resolver: zodResolver(stepper.current.schema),
    mode: "onTouched",
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      about: "",
      avatar: "",
      companyId: "",
      cv: undefined,
      position: "",
      phone: "",
      role: "MEMBER" as "MEMBER" | "RECRUITER",
    },
  });
  const { mutate } = useUploadImage({
    folder: "lokerin_cv",
  });
  const userRole = form.watch("role");
  const onSubmit = (values: z.infer<typeof stepper.current.schema>) => {
    const allFormData = form.getValues();
    if (stepper.isLast) {
      const userInput = {
        email: form.getValues("email"),
        password: form.getValues("password"),
        firstName: form.getValues("firstName"),
        lastName: form.getValues("lastName"),
        role: form.getValues("role"),
        phone: form.getValues("phone"),
      };

      const recruiterInput = {
        email: form.getValues("email"),
        password: form.getValues("password"),
        firstName: form.getValues("firstName"),
        lastName: form.getValues("lastName"),
        role: form.getValues("role"),
        phone: form.getValues("phone"),
        about: form.getValues("about"),
        companyId: form.getValues("companyId"),
        position: form.getValues("position"),
      };
    } else {
      if (stepper.current.id === "user" && userRole === "MEMBER") {
        stepper.goTo("media");
      } else {
        stepper.next();
      }
    }
  };
  const handleNext = async () => {
    const isValid = await form.trigger();
    if (!isValid) return;
    console.log(
      `Leaving step ${stepper.current.id}, current data:`,
      form.getValues()
    );
    if (stepper.current.id === "user" && userRole === "MEMBER") {
      stepper.goTo("media");
    } else {
      stepper.next();
    }
  };
  const handlePrev = () => {
    if (stepper.current.id === "media" && userRole === "MEMBER") {
      stepper.goTo("user");
    } else {
      stepper.prev();
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
        {stepper.switch({
          user: () => (
            <>
              <UserForm />
              <RoleForm />
            </>
          ),
          recruiter: () => <RecruiterForm />,
          media: () => (
            <>
              <AvatarForm />
              {userRole === "MEMBER" && <ResumeForm />}
            </>
          ),
        })}
        <div className="flex items-center flex-col-reverse sm:flex-row justify-between gap-4">
          {!stepper.isFirst && (
            <Button
              type="button"
              variant="outline"
              className={cn("w-full sm:w-auto")}
              onClick={handlePrev}
            >
              <ChevronsLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          )}
          {!stepper.isLast && (
            <Button
              type="button"
              variant={"default"}
              className={cn(stepper.isFirst ? "w-full " : "w-auto")}
              onClick={handleNext}
            >
              Next
              <ChevronsRight className="ml-2 h-4 w-4" />
            </Button>
          )}
          {stepper.isLast && (
            <Button
              type="submit"
              className={cn("w-full sm:w-auto")}
              disabled={form.formState.isSubmitting}
            >
              {!form.formState.isSubmitting ? (
                <>
                  <LogInIcon className="mr-2 h-4 w-4" /> Sign up
                </>
              ) : (
                <span className="flex items-center gap-2">
                  Signing up
                  <LoaderCircleIcon className="animate-spin" />
                </span>
              )}
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
