import { lokerinAPI } from "@/shared-api/config/api";
import { useQuery } from "@tanstack/react-query";





export const useCompany = (id: string) => useQuery({
    queryKey: ["companies", id],
    queryFn: async () => {
      const response = await lokerinAPI.get<CompanyResponse>(`/companies/${id}`);
      return response.data;
    },
}) 


export type CompanyResponse = {
  id: string
  name: string
  description: string
  website: string
  createdBy: string
  logoUrl: string
  createdAt: string
  updatedAt: string
  jobs: Array<{
    id: string
    title: string
    description: string
    location: string
    salaryRange: string
    postedBy: string
    createdAt: string
    updatedAt: string
    role: {
      id: string
      name: string
    }
  }>
}
