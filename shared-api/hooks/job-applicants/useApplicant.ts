import { lokerinAPI } from "@/shared-api/config/api";
import { useQuery } from "@tanstack/react-query";

export const  useApplicant = (id: string) =>
  useQuery({
    queryKey: ["applicants", id],
    queryFn: async () => {
      const response = await lokerinAPI.get<ApplicantResponse>(
        `/job-applicants/${id}`
      );
      return response.data;
    },
    placeholderData: (prev) => prev,
  });

export type ApplicantResponse = {
  id: string;
  status: "REJECTED" | "ACCEPTED" | "REVIEWED" | "APPLIED";
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    email: string;
    name: string;
    phone: string;
    avatarUrl: string;
    createdAt: string;
    updatedAt: string;
  };
  job: {
    id: string;
    location: string;
    description: string;
    role: {
      id: string;
      name: string;
    };
    company: {
      id: string;
      name: string;
      logoUrl: string;
      description: string;
      website: string;
    };
  };
};
