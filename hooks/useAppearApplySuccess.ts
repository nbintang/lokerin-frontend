// hooks/useAppearApplySuccess.ts
import { create } from "zustand";

type AppearApplySuccess = {
  appearApplySuccess: boolean;
  status: string;
  setAppearApplySuccess: (appear: boolean, status?: string) => void;
};

export const useAppearApplySuccess = create<AppearApplySuccess>((set) => ({
  appearApplySuccess: false,
  status: "",
  setAppearApplySuccess: (appear, status = "") =>
    set({ appearApplySuccess: appear, status }),
}));
