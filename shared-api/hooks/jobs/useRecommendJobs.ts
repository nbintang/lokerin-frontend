import { lokerinAPI } from "@/shared-api/config/api";
import { useRecommendationJobStore } from "@/shared-api/stores/useRecommendationJobStore";
import { useProgress } from "@bprogress/next";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import useSound from "use-sound";

type RecommendJobsOptions = {
  resumeUrl?: string;
  resumeFile?: File;
  minScore?: number;
};
export const useRecommendJobs = (
  opts?: Omit<
    UseMutationOptions<RecommendationsResponse, Error, RecommendJobsOptions>,
    | "mutationFn"
    | "mutationKey"
    | "onMutate"
    | "onSuccess"
    | "onError"
    | "onSettled"
  >
) => {
  const router = useRouter();
  const progress = useProgress();
  const [playNotification] = useSound(
    "/sounds/new-notification-014-363678_conv.mp3",
    {
      volume: 0.8,
    }
  );
  const setJobRes = useRecommendationJobStore((s) => s.setJobRes);
  return useMutation({
    mutationKey: ["recommend-job"],
    mutationFn: async ({
      resumeUrl,
      resumeFile,
      minScore,
    }: RecommendJobsOptions) => {
      const formData = new FormData();
      if (resumeFile) {
        formData.append("resume", resumeFile);
      } else if (resumeUrl) {
        formData.append("resumeUrl", resumeUrl);
      }
      formData.append("minScore", (minScore ?? 0.60).toString());
      const res = await lokerinAPI.post<RecommendationsResponse>(
        "/jobs/recommend-jobs",
        formData
      );
      return res.data;
    },
    onMutate: () => {
      const toastId = toast.loading("Wait a sec...");
      console.log(toastId);
      progress.start();
      return { toastId };
    },
    onSuccess: (res, _variables, context) => {
      if (context?.toastId) {
        toast.dismiss(context.toastId);
      }
      playNotification();
      setJobRes(res);
      toast.success("Job recommended successfully");
      router.push("/applier/dashboard/jobs/recommendation-results");
    },
    onError: (error, _variables, context) => {
      if (context?.toastId) {
        toast.dismiss(context.toastId);
      }
      if (isAxiosError(error)) {
        toast.error(error.response?.data.message ?? "Failed to recommend job");
      } else {
        toast.error("An unexpected error occurred");
      }
    },
    onSettled: () => {
      progress.stop();
    },
    ...opts,
  });
};


export type RecommendationsResponse = {
  recommendations: Array<Recommendations>;
  totalJobs: number;
  recommendedJobs: number;
};

export type Recommendations = {
  id: string;
  role: {
    name: string;
  };
  description: string;
  location: string;
  salaryRange: string;
  company: {
    name: string;
  };
  score: number;
  matchPercentage: number;
};
