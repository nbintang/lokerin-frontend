import { lokerinAPI } from "@/shared-api/config/api";
import { useProgress } from "@bprogress/next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import z from "zod";

export const useApplyJob = (id: string ) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const progress = useProgress();
  return useMutation({
    mutationKey: ["apply-job"],
    mutationFn: async ( ) => await lokerinAPI.post<ApplyJobResponse>(`/jobs/apply/${id}` ),
    onMutate: () => {
      const toastId = toast.loading("Applying job...");
      progress.start();
      return { toastId };
    },
    onSuccess: (_, _variables, context) => {
      if (context?.toastId) {
        toast.dismiss(context.toastId);
      }
      toast.success("Job applied successfully");
      queryClient.invalidateQueries({ queryKey: ["applied-jobs", "applied"] }); 
      queryClient.invalidateQueries({ queryKey: ["applied-jobs", id] }); 
      router.push(`/applier/dashboard/applied-jobs/applied`);
    },
    onError: (error, _variables, context) => {
      if (context?.toastId) {
        toast.dismiss(context.toastId);
      }
      if (isAxiosError(error)) {
        toast.error(error.response?.data.message ?? "Failed to apply job");
      } else {
        toast.error("An unexpected error occurred");
      }
    },
    onSettled: () => {
      progress.stop();
    },
  });
};


export type ApplyJobResponse = {
  id: string
  status: string
  createdAt: string
  updatedAt: string
  user: {
    id: string
    email: string
    avatarUrl: string
    cvUrl: string
    name: string
  }
  job: {
    role: {
      name: string
    }
  }
}
