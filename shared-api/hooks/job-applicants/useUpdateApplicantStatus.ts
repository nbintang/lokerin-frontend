import { lokerinAPI } from "@/shared-api/config/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApplicantResponse } from "./useApplicant";
import { toast } from "sonner";
import { isAxiosError } from "axios";

export const useUpdateApplicantStatus = (id: string, jobId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["update-applicant-status"],
    mutationFn: async (body: { status: ApplicantResponse["status"] }) =>
      await lokerinAPI.put<ApplicantResponse>(`/job-applicants/applicants/${id}`, body, {
        params: {
          jobId,
        },
      }),
    onMutate: () => {
      const toastId = toast.loading("Updating Status...");
      console.log(toastId);
      return { toastId };
    },
    onSuccess: (_, _variables, context) => {
      if (context?.toastId) {
        toast.dismiss(context.toastId);
      }
      toast.success("Status updated successfully");
      queryClient.invalidateQueries({ queryKey: ["applicants"] });
      queryClient.invalidateQueries({ queryKey: ["applicants", id] });
    },
    onError: (error, _variables, context) => {
      if (context?.toastId) {
        toast.dismiss(context.toastId);
      }
      if (isAxiosError(error)) {
        toast.error(error.response?.data.message ?? "Failed to update status");
      } else {
        toast.error("An unexpected error occurred");
      }
    },
  });
};
