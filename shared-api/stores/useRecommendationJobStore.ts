import { create } from "zustand";
import { RecommendationsResponse } from "../hooks/jobs/useRecommendJobs";

type RecommendationJobStore = {
  jobRes: RecommendationsResponse;
  setJobRes: (jobRes: RecommendationsResponse) => void;
};

export const useRecommendationJobStore = create<RecommendationJobStore>(
  (set) => ({
    jobRes: {
      recommendations: [],
      totalJobs: 0,
      recommendedJobs: 0,
    },
    setJobRes: (jobRes: RecommendationsResponse) => set({ jobRes }),
  })
);
