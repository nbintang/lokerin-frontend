import { lokerinAPI } from "@/shared-api/config/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";
import { isAxiosError } from "axios";
import { RecruiterProfileResponse } from "./type";

export const useUpdateRecruiterProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["recruiter-profile"],
    mutationFn: async (body: {
      avatarUrl: string;
      about: string;
      name: string;
      position: string;
    }) => {
      const response = await lokerinAPI.patch<RecruiterProfileResponse>(
        "/recruiters/profile",
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
      queryClient.invalidateQueries({ queryKey: ["recruiter-profile"] });
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
