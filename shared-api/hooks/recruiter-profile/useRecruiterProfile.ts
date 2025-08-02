import { lokerinAPI } from "@/shared-api/config/api";
import { useQuery } from "@tanstack/react-query";
import { RecruiterProfileResponse } from "./type";

export const useRecruiterProfile = () => useQuery({
    queryKey: ["recruiter-profile"],
    queryFn: async () => {
      const response = await lokerinAPI.get<RecruiterProfileResponse>(
        "/recruiters/profile"
      );
      return response.data;
    },
  });
 