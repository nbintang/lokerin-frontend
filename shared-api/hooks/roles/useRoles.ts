import { lokerinAPI } from "@/shared-api/config/api";
import { useQuery } from "@tanstack/react-query";
type RolesOptions = {
  page?: number;
  limit?: number;
  name?: string;
};

export const useRoles = (params?: RolesOptions) =>
  useQuery({
    queryKey: ["roles"],
    queryFn: async () => {
      const response = await lokerinAPI.get<RolesResponse>("/roles", { params });
      return response.data;
    },
  });

export type Roles= {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
  }
export type RolesResponse = {
  roles: Array<Roles>;
  page: number;
  limit: number;
  total: number;
};
