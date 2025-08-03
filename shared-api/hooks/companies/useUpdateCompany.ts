import { lokerinAPI } from "@/shared-api/config/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Company } from "./useCompanies";
import { toast } from "sonner";
import { isAxiosError } from "axios";
type UpdateCompanyRequest = {
  id: string;
  logoUrl: string;
  description: string;
  name: string;
  website: string;
};
export const useUpdateCompany = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: UpdateCompanyRequest) => {
      const { id, ...rest } = data;
      const response = await lokerinAPI.patch<Company>(
        `/companies/${id}`,
        rest
      );
      return response.data;
    },
    onMutate: () => {
      const toastId = toast.loading("Updatating company...");
      console.log(toastId);
      return { toastId };
    },
    onSuccess: (_, _variables, context) => {
      if (context?.toastId) {
        toast.dismiss(context.toastId);
      }
      queryClient.invalidateQueries({ queryKey: ["companies", id] });
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      toast.success("Company updated successfully");
    },
    onError: (error, _variables, context) => {
      if (context?.toastId) {
        toast.dismiss(context.toastId);
      }
      if (isAxiosError(error)) {
        toast.error(error.response?.data.message ?? "Failed to update company");
      } else {
        toast.error("An unexpected error occurred");
      }
    },
  });
};
