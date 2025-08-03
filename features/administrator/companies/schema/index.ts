import { z } from "zod";

export const companySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, "Name must be at least 3 characters").max(50).trim(),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description must be at most 1000 characters")
    .trim(),
  logoUrl: z.url(),
  website: z.url().trim(),
});

export type CompanySchema = z.infer<typeof companySchema>;
