import { lokerinAPI } from "@/shared-api/config/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useUpdateJob = (id: string) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["update-job"], //update request
    mutationFn: async (body: {
      description: string;
      location: string;
      salaryRange: string;
      role: string;
    }) => await lokerinAPI.put<PutJobResponse>(`/jobs/${id}`, body),
    onMutate: () => {
      const toastId = toast.loading("Updating job...");
      console.log(toastId);
      return { toastId };
    },
    onSuccess: (_, _variables, context) => {
      if (context?.toastId) {
        toast.dismiss(context.toastId);
      }
      toast.success("Job updated successfully");
      queryClient.invalidateQueries({ queryKey: ["jobs", id] });
      router.push("/recruiter/dashboard/jobs");
    },
    onError: (error, _variables, context) => {
      if (context?.toastId) {
        toast.dismiss(context.toastId);
      }
      if (isAxiosError(error)) {
        toast.error(error.response?.data.message ?? "Failed to update job");
      } else {
        toast.error("An unexpected error occurred");
      }
    },
  });
};

export type PutJobResponse = {
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
