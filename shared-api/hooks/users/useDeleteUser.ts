import { lokerinAPI } from "@/shared-api/config/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

export const useDeleteUser = (id: string) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationKey: ["delete-user"],
    mutationFn: async () =>
      await lokerinAPI.delete<{ message: string }>(`/users/${id}`),
    onMutate: () => {
      const toastId = toast.loading("Deleting user...");
      console.log(toastId);
      return { toastId };
    },
    onSuccess: (_, v, ctx) => {
      if (ctx?.toastId) {
        toast.dismiss(ctx.toastId);
      }
      toast.success("User deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["users", id] });
      router.push("/administrator/dashboard/users");
    },
    onError: (error, _variables, context) => {
      if (context?.toastId) {
        toast.dismiss(context.toastId);
      }
      if (isAxiosError(error)) {
        toast.error(error.response?.data.message ?? "Failed to delete user");
      } else {
        toast.error("An unexpected error occurred");
      }
    },
  });
};
