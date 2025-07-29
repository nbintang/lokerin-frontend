import { lokerinAPI } from "@/shared-api/config/api";
import { useProgress } from "@bprogress/next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import z from "zod";

export const useCreateJob = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const progress = useProgress();
  return useMutation({
    mutationKey: ["create-job"],
    mutationFn: async (body: {
      description: string;
      location: string;
      salaryRange: string;
      role: string;
    }) => await lokerinAPI.post<CreateJobResponse>("/jobs", body),
    onMutate: () => {
      const toastId = toast.loading("Creating job...");
      console.log(toastId);
      progress.start();
      return { toastId };
    },
    onSuccess: (_, _variables, context) => {
      if (context?.toastId) {
        toast.dismiss(context.toastId);
      }
      toast.success("Job created successfully");
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      router.push("/recruiter/dashboard/jobs");
    },
    onError: (error, _variables, context) => {
      if (context?.toastId) {
        toast.dismiss(context.toastId);
      }
      if (isAxiosError(error)) {
        toast.error(error.response?.data.message ?? "Failed to create job");
      } else {
        toast.error("An unexpected error occurred");
      }
    },
    onSettled: () => {
      progress.stop();
    },
  });
};

export type CreateJobResponse = {
  id: string;
  description: string;
  location: string;
  salaryRange: string;
  postedBy: string;
  createdAt: string;
  updatedAt: string;
  role: {
    id: string;
    name: string;
  };
  company: {
    id: string;
    name: string;
  };
};
