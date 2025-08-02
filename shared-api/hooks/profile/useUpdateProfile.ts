import { lokerinAPI } from "@/shared-api/config/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UserProfileResponse } from "./type";
import { toast } from "sonner";
import { isAxiosError } from "axios";

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["profile"],
    mutationFn: async (body: {
      avatarUrl: string;
      cvUrl: string;
      name: string;
    }) => {
      const response = await lokerinAPI.patch<UserProfileResponse>(
        "/users/me",
        body
      );
      return response.data;
    },
    onMutate: () => {
      const toastId = toast.loading("Updating profile...");
      console.log(toastId);
      return { toastId };
    },
    onSuccess: (_, _variables, context) => {
      if (context?.toastId) {
        toast.dismiss(context.toastId);
      }
      toast.success("Profile updated successfully");
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (error, _variables, context) => {
      if (context?.toastId) {
        toast.dismiss(context.toastId);
      }
      if (isAxiosError(error)) {
        toast.error(error.response?.data.message ?? "Failed to update profile");
      } else {
        toast.error("An unexpected error occurred");
      }
    },
  });
};
