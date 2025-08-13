import { zodImageSchema } from "@/schemas/imageSchema";
import { zodResumeSchema } from "@/schemas/resumeSchema";
import z from "zod";

export const userSchema = z
  .object({
    firstName: z
      .string()
      .min(3, "First name must be at least 3 characters")
      .max(50)
      .trim(),
    lastName: z
      .string()
      .min(3, "Last name must be at least 3 characters")
      .max(50)
      .trim(),
    email: z.email().min(3, "Email must be at least 3 characters").max(50),
    phone: z
      .string()
      .min(3, "Phone number must be at least 3 characters")
      .max(20, "Phone number must be at most 20 characters")
      .regex(/^\d+$/, "Phone number must contain only numbers"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(50)
      .regex(/^(?=.*[A-Z])(?=.*\d).+$/, {
        message:
          "Password must contain at least one uppercase letter and one number",
      }),
    confirmPassword: z.string(),
    role: z.enum(["MEMBER", "RECRUITER"]),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
export type UserSchema = z.infer<typeof userSchema>;

// gabungkan role ke dalam mediaSchema
export const mediaSchema = z
  .object({
    avatar: zodImageSchema().optional(),
    cv: zodResumeSchema().optional(),
    role: z.enum(["MEMBER", "RECRUITER"]), // tambahkan role
  })
  .refine((data) => !(data.role === "MEMBER" && !data.cv), {
    message: "CV wajib diunggah untuk MEMBER",
    path: ["cv"],
  });

export type MediaSchema = z.infer<typeof mediaSchema>;

export const recruiterSchema = z.object({
  position: z.string().min(3, "Role must be at least 3 characters").max(50),
  about: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description must be at most 1000 characters"),
  companyId: z.string(),
});
export type RecruiterSchema = z.infer<typeof recruiterSchema>;
