import z from "zod";

export const zodResumeSchema = (size: number = 5 * 1024 * 1024) =>
  z
    .array(z.custom<File>())
    .min(1, "Please select at least one file")
    .max(1, "You can only upload one file")
    .refine((files) => files.every((file) => file.size <= size), {
      message: "File size must be less than 5MB",
      path: ["files"],
    })
