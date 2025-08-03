import { lokerinAPI } from "@/shared-api/config/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "sonner";

export const useDeleteApplicant = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["delete-job-applicant"],
    mutationFn: async () =>
      await lokerinAPI.delete(`/job-applicants/applicants/${id}`),
    onMutate: () => {
      const toastId = toast.loading("Deleting job applicant...");
      console.log(toastId);
      return { toastId };
    },
    onSuccess: (_, _variables, context) => {
      if (context?.toastId) {
        toast.dismiss(context.toastId);
      }
      toast.success("Job applicant deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["applicants"] });
      queryClient.invalidateQueries({ queryKey: ["applicants", id] });
    },
    onError: (error, _variables, context) => {
      if (context?.toastId) {
        toast.dismiss(context.toastId);
      }
      if (isAxiosError(error)) {
        toast.error(
          error.response?.data.message ?? "Failed to delete job applicant"
        );
      } else {
        toast.error("An unexpected error occurred");
      }
    },
  });
};
