import { lokerinAPI } from "@/shared-api/config/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApplicantResponse } from "./useApplicant";
import { toast } from "sonner";
import { isAxiosError } from "axios";

export const useUpdateApplicantsStatus = (jobId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["update-applicant-status"],
    mutationFn: async (body: {
      status: ApplicantResponse["status"];
      applicantIds: string[];
    }) =>
      await lokerinAPI.patch<ApplicantResponse[]>(
        `/job-applicants/applicants`,
        body,
        {
          params: {
            jobId,
          },
        }
      ),
    onMutate: () => {
      const toastId = toast.loading("Updating Statuses...");
      console.log(toastId);
      return { toastId };
    },
    onSuccess: (res, _variables, context) => {
      if (context?.toastId) {
        toast.dismiss(context.toastId);
      }
      toast.success("Statuses updated successfully");
      queryClient.invalidateQueries({ queryKey: ["applicants"] });
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
