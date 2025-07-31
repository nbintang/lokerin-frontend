import { create } from "zustand";
type HandleAiFeatures = {
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
};
export const useHandleAiFeaturesDialog = create<HandleAiFeatures>((set) => ({
  isOpen: false,
  setOpen: (isOpen) => set({ isOpen }),
}));
