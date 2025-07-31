import { lokerinAPI } from "@/shared-api/config/api";
import { useQuery } from "@tanstack/react-query";
import { AppliedJobResponse } from "./useAppliedJob";
type AppliedJobOptions = {
  page: number;
  limit: number;
  status?: string;
  jobId?: string;
};
export const useAppliedJobs = ({
  page,
  limit,
  status,
  jobId,
}: AppliedJobOptions) =>
  useQuery({
    queryKey: ["applied-jobs", status],
    queryFn: async () => {
      const response = await lokerinAPI.get<AppliedJobsResponse>(
        "/job-applicants/applied",
        { params: { page, limit, status } }
      );
      return response.data;
    },
    placeholderData: (prev) => prev,
  });

export type AppliedJobsResponse = {
  appliedJobs: Array<AppliedJobResponse>;
  page: number;
  limit: number;
  total: number;
};
