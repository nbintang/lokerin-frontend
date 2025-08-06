import { lokerinAPI } from "@/shared-api/config/api";
import { useQuery } from "@tanstack/react-query";

type ApplicantsOptions = {
  page?: number;
  limit?: number;
  isForAdmin?: boolean;
  name?: string;
};

export const useApplicants = ({
  page = 1,
  limit = 10,
  isForAdmin = false,
  name,
}: ApplicantsOptions) =>
  useQuery({
    queryKey: ["applicants",  { page, limit, name }],
    queryFn: async () => {
      const response = await lokerinAPI.get<JobApplicantsResponse>(
        `/job-applicants${isForAdmin ? "" : "/applicants"}`,
        { params: { page, limit, name } }
      );
      return response.data;
    },
    placeholderData: (prev) => prev,
  });

export interface JobApplicantsResponse {
  appliers: Applier[];
  page: number;
  limit: number;
  total: number;
}

export interface Applier {
  id: string;
  status: "APPLIED" | "REVIEWED" | "REJECTED" | "ACCEPTED";
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: string;
    email: string;
    avatarUrl: string;
    name: string;
    cvUrl: string;
  };
  job: {
    id: string;
    role: {
      name: string;
    };
  };
}
