import { useMutation, useQueryClient } from "@tanstack/react-query";
import { lokerinAPI } from "@/shared-api/config/api";
import { toast } from "sonner";
import { isAxiosError } from "axios";

export const useDeleteJob = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["delete-job"],
    mutationFn: async () =>
      await lokerinAPI.delete<{ message: string }>(`/jobs/${id}`),
    onMutate: () => {
      const toastId = toast.loading("Deleting job...");
      console.log(toastId);
      return { toastId };
    },
    onSuccess: (_, _variables, context) => {
      if (context?.toastId) {
        toast.dismiss(context.toastId);
      }
      toast.success("Job deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["jobs", id] });
    },
    onError: (error, _variables, context) => {
      if (context?.toastId) {
        toast.dismiss(context.toastId);
      }
      if (isAxiosError(error)) {
        toast.error(error.response?.data.message ?? "Failed to delete job");
      } else {
        toast.error("An unexpected error occurred");
      }
    },
  });
};
