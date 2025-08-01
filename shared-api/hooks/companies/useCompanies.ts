import { lokerinAPI } from "@/shared-api/config/api";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import React from "react";
type CompanyParamOptions = {
  page?: number;
  limit?: number;
  name?: string;
};
export const useCompanies = ({
  limit,
  page,
  name,
}: CompanyParamOptions): UseQueryResult<CompaniesResponse> =>
  useQuery({
    queryKey: ["companies"],
    queryFn: async () => {
      const response = await lokerinAPI.get<CompaniesResponse>("/companies", {
        params: {
          page,
          limit,
          name,
        },
      });
      return response.data;
    },
  });
export type Company ={
    id: string;
    name: string;
    description: string;
    website: string;
    createdBy: string;
    logoUrl: string;
    createdAt: string;
    updatedAt: string;
  }
export type CompaniesResponse = {
  companies: Array<Company>;
  page: number;
  limit: number;
  total: number;
};
