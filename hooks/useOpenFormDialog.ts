import { Company } from "@/shared-api/hooks/companies/useCompanies";
import { Roles } from "@/shared-api/hooks/roles/useRoles";
import { create } from "zustand";

type OpenFormKeys = "company" | "role";
type OpenFormDialogStore = {
  key: OpenFormKeys | "";
  isOpen: boolean;
  description: string;
  titleSuccess: string;
  titleError: string;
  isError?: boolean;
  data: Company | Roles | {};
  isSuccess?: boolean;
  setCompany: (data?: Company) => void;
  setPosition: (data?: Roles) => void;
  setOpenDialog: (
    key: OpenFormKeys,
    options: {
      description: string;
      titleSuccess?: string;
      titleError?: string;
      isError?: boolean;
      isSuccess?: boolean;
    }
  ) => void;
  closeDialog: (delay?: number) => void;
};

export const useOpenFormDialogStore = create<OpenFormDialogStore>((set) => ({
  key: "",
  data: {},
  isOpen: false,
  titleSuccess: "Success",
  titleError: "Failed to create...",
  isError: false,
  isSuccess: false,
  description: "",
  setCompany: (data) => set({ key: "company", isOpen: true, data }),
  setPosition: (data) => set({ key: "role", isOpen: true, data }),
  setOpenDialog: (key, options) => set({ key, isOpen: true, ...options }),
  closeDialog: (delay = 1) => {
    if (delay > 0) {
      setTimeout(() => {
        set({
          isOpen: false,
          key: "",
          description: "",
          isError: false,
          isSuccess: false,
        });
      }, delay);
    } else {
      set({
        isOpen: false,
        key: "",
        description: "",
        isError: false,
        isSuccess: false,
      });
    }
  },
}));
