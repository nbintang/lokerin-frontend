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
import { defineStepper } from "@stepperize/react";
import { mediaSchema, recruiterSchema, userSchema } from "./schema";
import UserInput from "./components/UserInput";
import RecruiterInput from "./components/RecruiterInput";
import AvatarInput from "./components/AvatarInput";
import ResumeInput from "./components/ResumeInput";
import RoleInput from "./components/RoleInput";
import { cn } from "@/lib/utils";
import useUploadImage from "@/shared-api/hooks/media/useUploadImage";
import useUploadDocument from "@/shared-api/hooks/media/useUploadDocument";
import useSignUpUser from "./hooks/useSignUpUser";
import useSignUpRecruiter from "./hooks/useSignUpRecruiter";

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
  const uploadImage = useUploadImage({});
  const uploadDocument = useUploadDocument({});
  const signUpUser = useSignUpUser();
  const signUpRecruiter = useSignUpRecruiter();
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
  const userRole = form.watch("role");
  const onSubmit = async () => {
    if (stepper.isLast) {
      const isRoles = form.getValues("role");
      const { secureUrl: avatarUrl } = await uploadImage.mutateAsync(
        form.getValues("avatar") ?? ""
      );
       const userInput = {
          email: form.getValues("email"),
          password: form.getValues("password"),
          name: `${form.getValues("firstName")} ${form.getValues("lastName")}`,
          phone: form.getValues("phone"),
          avatarUrl,
        };
      if (isRoles === "MEMBER") {
        const applierInput = {
          ...userInput,
          avatarUrl,
        };
        const { secureUrl: cvUrl } = await uploadDocument.mutateAsync(
          form.getValues("cv")?.[0] ?? ""
        );
        signUpUser.mutate({
          ...applierInput,
          cvUrl,
        });
      } else if (isRoles === "RECRUITER") {
        const recruiterInput = {
          ...userInput,
          about: form.getValues("about"),
          companyId: form.getValues("companyId"),
          position: form.getValues("position"),
        };
        signUpRecruiter.mutate(recruiterInput);
      }
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
  const isSubmitting =
    form.formState.isSubmitting ||
    signUpUser.isPending ||
    signUpRecruiter.isPending;
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
        {stepper.switch({
          user: () => (
            <>
              <UserInput />
              <RoleInput />
            </>
          ),
          recruiter: () => <RecruiterInput />,
          media: () => (
            <>
              <AvatarInput />
              {userRole === "MEMBER" && <ResumeInput />}
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
              disabled={isSubmitting}
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
              disabled={isSubmitting}
            >
              Next
              <ChevronsRight className="ml-2 h-4 w-4" />
            </Button>
          )}
          {stepper.isLast && (
            <Button
              type="submit"
              className={cn("w-full sm:w-auto")}
              disabled={isSubmitting}
            >
              {!isSubmitting ? (
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
