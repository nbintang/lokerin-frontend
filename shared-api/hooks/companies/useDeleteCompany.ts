import { lokerinAPI } from "@/shared-api/config/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { isAxiosError } from "axios";

export const useDeleteCompany = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const response = await lokerinAPI.delete(`/companies/${id}`);
      return response.data;
    },
    onMutate: () => {
      const toastId = toast.loading("Deleting company...");
      console.log(toastId);
      return { toastId };
    },
    onSuccess: (_, _variables, context) => {
      if (context?.toastId) {
        toast.dismiss(context.toastId);
      }
      queryClient.invalidateQueries({ queryKey: ["companies", id] });
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      toast.success("Company deleted successfully");
    },
    onError: (error, _variables, context) => {
      if (context?.toastId) {
        toast.dismiss(context.toastId);
      }
      if (isAxiosError(error)) {
        toast.error(error.response?.data.message ?? "Failed to delete company");
      } else {
        toast.error("An unexpected error occurred");
      }
    },
  });
};
