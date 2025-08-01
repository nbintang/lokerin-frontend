import { zodImageSchema } from "@/schemas/imageSchema";
import { resumeSchema } from "@/schemas/resumeSchema";
import z from "zod";

export const userSchema = z
  .object({
    firstName: z
      .string()
      .min(3, "First name must be at least 3 characters")
      .max(50),
    lastName: z
      .string()
      .min(3, "Last name must be at least 3 characters")
      .max(50),
    email: z.email().min(3, "Email must be at least 3 characters").max(50),
    phone: z.coerce
      .number()
      .min(3, "Phone must be at least 3 characters")
      .refine((value) => value.toString().length === 10, {
        message: "Phone must be 10 digits",
      }),
    password: z.string().regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, {
      message:
        "Password must be at least 8 characters long and contain at least one letter and one number",
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
    cv: resumeSchema().optional(),
    role: z.enum(["MEMBER", "RECRUITER"]),   // tambahkan role
  })
  .refine(
    (data) => !(data.role === "MEMBER" && !data.cv),
    {
      message: "CV wajib diunggah untuk MEMBER",
      path: ["cv"],
    }
  );

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
