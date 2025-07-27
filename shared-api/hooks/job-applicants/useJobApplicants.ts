import { lokerinAPI } from "@/shared-api/config/api";
import { useQuery } from "@tanstack/react-query";

export const useJobApplicants = (page: number = 1, limit: number = 10) =>
  useQuery({
    queryKey: ["applicants"],
    queryFn: async () => {
      const response = await lokerinAPI.get<JobApplicantResponse>(
        "/job-applicants",
        { params: { page, limit } }
      );
      return response.data;
    },
    placeholderData: (prev) => prev,
  });

export interface JobApplicantResponse {
  applyers: Applyer[];
  page: number;
  limit: number;
  total: number;
}

export interface Applyer {
  id: string;
  status: "APPLIED" | "REVIEWED" | "REJECTED" | "ACCEPTED";
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: string;
    email: string;
    avatarUrl: string;
    name: string;
  };
  job: {
    id: string;
    title: string;
  };
}
