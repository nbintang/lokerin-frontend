import { lokerinAPI } from "@/shared-api/config/api";
import { useQuery } from "@tanstack/react-query";

export const useProfile = () =>
  useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const response = await lokerinAPI.get<UserProfileResponse>("/users/me");
      return response.data;
    },
    placeholderData: (prev) => prev,
  });

export interface UserProfileResponse     {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  avatarUrl: string;
  cvUrl: string
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}
