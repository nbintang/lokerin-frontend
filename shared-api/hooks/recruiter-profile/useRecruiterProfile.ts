import { lokerinAPI } from "@/shared-api/config/api";
import { useQuery } from "@tanstack/react-query";

export const useRecruiterProfile = () => useQuery({
    queryKey: ["recruiter-profile"],
    queryFn: async () => {
      const response = await lokerinAPI.get<RecruiterProfile>(
        "/recruiters/profile"
      );
      return response.data;
    },
  });
export interface RecruiterProfile  {
  id: string
  about: string
  createdAt: string
  updatedAt: string
  user: {
    id: string
    name: string
    email: string
    phone: string
    avatarUrl: string
    isVerified: boolean
    createdAt: Date
    updatedAt: Date
  }
  company: {
    id: string
    name: string
    description: string
    website: string
    createdBy: string
    logoUrl: string
    createdAt: Date
    updatedAt: Date
  }
  position: {
    id: string
    name: string
    createdAt: Date
    updatedAt: Date
  }
}
