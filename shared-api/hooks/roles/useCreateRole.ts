import { lokerinAPI } from "@/shared-api/config/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { Role } from "./useRoles";

export const useCreateRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["create-role"],
    mutationFn: async (data: { name: string }) => {
      const response = await lokerinAPI.post<Role>("/roles", data);
      return response.data;
    },
    onMutate: () => {
      const toastId = toast.loading("Creating role...");
      console.log(toastId);
      return { toastId };
    },
    onSuccess: (_, _variables, context) => {
      if (context?.toastId) {
        toast.dismiss(context.toastId);
      }
      toast.success("Role created successfully");
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
    onError: (error, _variables, context) => {
      if (context?.toastId) {
        toast.dismiss(context.toastId);
      }
      if (isAxiosError(error)) {
        toast.error(error.response?.data.message ?? "Failed to create role");
      } else {
        toast.error("An unexpected error occurred");
      }
    },
  });
};
