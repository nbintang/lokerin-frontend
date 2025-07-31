import { ApplicantResponse } from "@/shared-api/hooks/job-applicants/useApplicant";
import { create } from "zustand";

interface ApplicantDialog {
  status: ApplicantResponse["status"];
  id: string;
  jobId: string;
}

interface HandleStatusDialog {
  isOpen: boolean;
  applicant: ApplicantDialog;
  setOpen: ({
    isOpen,
    applicant,
  }: {
    isOpen: boolean;
    applicant: ApplicantDialog;
  }) => void;
}

const useHandleSelectStatusDialog = create<HandleStatusDialog>((set) => ({
  isOpen: false,
  applicant: { status: "APPLIED", id: "", jobId: "" },
  setOpen: ({
    isOpen,
    applicant,
  }: {
    isOpen: boolean;
    applicant: ApplicantDialog;
  }) => set({ isOpen, applicant }),
}));

export default useHandleSelectStatusDialog;
