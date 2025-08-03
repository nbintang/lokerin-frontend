import { lokerinAPI } from "@/shared-api/config/api";
import { useQuery } from "@tanstack/react-query";

export const useApplicants = (
  page: number = 1,
  limit: number = 10,
  isForAdmin: boolean = false
) =>
  useQuery({
    queryKey: ["applicants"],
    queryFn: async () => {
      const response = await lokerinAPI.get<JobApplicantResponse>(
        `/job-applicants${isForAdmin ? "" : "/applicants"}`,
        { params: { page, limit } }
      );
      return response.data;
    },
    placeholderData: (prev) => prev,
  });

export interface JobApplicantResponse {
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
