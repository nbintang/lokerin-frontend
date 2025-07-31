import { lokerinAPI } from "@/shared-api/config/api";
import { useQuery } from "@tanstack/react-query";
import { AppliedJobResponse } from "./useAppliedJob";

export const useAppliedJobs = (
  page: number = 1,
  limit: number = 10,
  status:string
) =>
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
