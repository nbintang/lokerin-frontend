import { lokerinAPI } from "@/shared-api/config/api";
import { useQuery } from "@tanstack/react-query"


export const useRoles = () => useQuery({
    queryKey: ["roles"],
    queryFn: async () => {
        const response = await lokerinAPI.get<Roles>("/roles");
        return response.data;
    }
})
export type Roles = {
  roles: Array<{
    id: string
    name: string
    createdAt: string
    updatedAt: string
  }>
  page: number
  limit: number
  total: number
}
