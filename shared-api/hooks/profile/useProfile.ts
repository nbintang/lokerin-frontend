import { lokerinAPI } from "@/shared-api/config/api";
import { useQuery } from "@tanstack/react-query";
import { UserProfileResponse } from "./type";

export const useProfile = () =>
  useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const response = await lokerinAPI.get<UserProfileResponse>("/users/me");
      return response.data;
    },
    placeholderData: (prev) => prev,
  });

