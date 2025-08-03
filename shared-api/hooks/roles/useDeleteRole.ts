import { lokerinAPI } from "@/shared-api/config/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { Role } from "./useRoles";

export const useDeleteRole = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["delete-role"],
    mutationFn: async () => await lokerinAPI.delete<Role>(`/roles/${id}`),
    onMutate: () => {
      const toastId = toast.loading("Deleting role...");
      console.log(toastId);
      return { toastId };
    },
    onSuccess: (_, _variables, context) => {
      if (context?.toastId) {
        toast.dismiss(context.toastId);
      }
      toast.success("Role deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
    onError: (error, _variables, context) => {
      if (context?.toastId) {
        toast.dismiss(context.toastId);
      }
      if (isAxiosError(error)) {
        toast.error(error.response?.data.message ?? "Failed to delete role");
      } else {
        toast.error("An unexpected error occurred");
      }
    },
  });
};
