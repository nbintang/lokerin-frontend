import { lokerinAPI } from "@/shared-api/config/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Company } from "./useCompanies";
import { toast } from "sonner";
import { isAxiosError } from "axios";
type CreateCompanyRequest = {
  logoUrl: string;
  description: string;
  name: string;
  website: string;
};
export const useCreateCompany = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateCompanyRequest) => {
      const response = await lokerinAPI.post<Company>("/companies", data);
      return response.data;
    },
    onMutate: () => {
      const toastId = toast.loading("Creating company...");
      console.log(toastId);
      return { toastId };
    },
    onSuccess: (_, _variables, context) => {
      if (context?.toastId) {
        toast.dismiss(context.toastId);
      }
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      toast.success("Company created successfully");
    },
    onError: (error, _variables, context) => {
      if (context?.toastId) {
        toast.dismiss(context.toastId);
      }
      if (isAxiosError(error)) {
        toast.error(error.response?.data.message ?? "Failed to create company");
      } else {
        toast.error("An unexpected error occurred");
      }
    },
  });
};
