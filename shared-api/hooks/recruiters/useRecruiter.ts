import { lokerinAPI } from "@/shared-api/config/api";
import { useQuery } from "@tanstack/react-query";

export const useRecruiter = (id: string) => useQuery({
    queryKey: ["recruiters", id],
    queryFn: async () => {
        const response = await lokerinAPI.get<RecruiterResponse>(`/recruiters/${id}`);
        return response.data;
    },
})


export type RecruiterResponse = {
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
    cvUrl: any
    isVerified: boolean
    createdAt: string
    updatedAt: string
  }
  company: {
    id: string
    name: string
    description: string
    website: string
    createdBy: string
    logoUrl: string
    createdAt: string
    updatedAt: string
  }
  position: {
    id: string
    name: string
    createdAt: string
    updatedAt: string
  }
}

 