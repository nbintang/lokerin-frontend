"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";

const salaryRanges = [
  "Less than 100000",
  "100000 - 200000",
  "200000 - 300000",
  "300000 - 400000",
  "400000 - 500000",
  "500000 - 600000",
  "600000 - 700000",
  "700000 - 800000",
  "800000 - 900000",
  "900000 - 1000000",
  "1000000 - 1100000",
  "1100000 - 1200000",
  "1200000 - 1300000",
  "1300000 - 1400000",
  "1400000 - 1500000",
  "1500000 - 1600000",
  "1600000 - 1700000",
  "1700000 - 1800000",
  "1800000 - 1900000",
  "1900000 - 2000000",
  "2000000 - 2100000",
  "2100000 - 2200000",
  "2200000 - 2300000",
  "2300000 - 2400000",
  "2400000 - 2500000",
  "more than 2500000",
];

const newJobSchema = z.object({
  title: z.string(),
  description: z.string(),
  location: z.string(),
  salaryRange: z.enum(salaryRanges),
  role: z.string(),
});
type NewJob = z.infer<typeof newJobSchema>;
export default function NewJob() {
    const form = useForm<NewJob>({
        resolver: zodResolver(newJobSchema),
        defaultValues: {
            title: "",
            description: "",
            location: "",
            salaryRange: "Less than 100000",
            role: "",
        },
    })
  return <div></div>;
}
