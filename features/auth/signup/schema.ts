import { zodImageSchema } from "@/schemas/imageSchema";
import { resumeSchema } from "@/schemas/resumeSchema";
import { defineStepper } from "@stepperize/react";
import z from "zod";

export const userSchema = z
  .object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.url(),
    phone: z.number(),
    password: z.string().regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, {
      message:
        "Password must be at least 8 characters long and contain at least one letter and one number",
    }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
export type UserSchema = z.infer<typeof userSchema>;

export const mediaSchema = z.object({
  avatar: zodImageSchema().optional(),
  cv: resumeSchema().optional(),
});
export type MediaSchema = z.infer<typeof mediaSchema>;


export const recruiterSchema1 = userSchema.extend({
  position: z.string().min(3, "Role must be at least 3 characters").max(50),
  about: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description must be at most 1000 characters"),
  companyId: z.string(),
});
export type RecruiterSchema = z.infer<typeof recruiterSchema1>;

export const recruiterSchema2 = mediaSchema.omit({ cv: true });
export type RecruiterSchema2 = z.infer<typeof recruiterSchema2>;

export const userStepper = defineStepper(
  { id: "user", label: "User", schema: userSchema },
  { id: "recruiter", label: "Recruiter", schema: recruiterSchema1 },
  { id: "media", label: "Media", schema: mediaSchema },
  { id: "recruiter2", label: "Recruiter", schema: recruiterSchema2 }
);
