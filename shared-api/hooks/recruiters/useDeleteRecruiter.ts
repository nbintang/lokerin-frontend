import { lokerinAPI } from "@/shared-api/config/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "sonner";

export const useDeleteRecruiter = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["delete-recruiter"],
    mutationFn: async () =>
      await lokerinAPI.delete<{ message: string }>(`/recruiters/${id}`),
    onMutate: () => {
      const toastId = toast.loading("Deleting job...");
      console.log(toastId);
      return { toastId };
    },
    onSuccess: (_, _variables, context) => {
      if (context?.toastId) {
        toast.dismiss(context.toastId);
      }
      queryClient.invalidateQueries({ queryKey: ["recruiters"] });
      queryClient.invalidateQueries({ queryKey: ["recruiters", id] });
      toast.success("Recruiter deleted successfully");
    },
    onError: (error, _variables, context) => {
      if (context?.toastId) {
        toast.dismiss(context.toastId);
      }
      if (isAxiosError(error)) {
        toast.error(
          error.response?.data.message ?? "Failed to delete recruiter"
        );
      } else {
        toast.error("An unexpected error occurred");
      }
    },
  });
};
