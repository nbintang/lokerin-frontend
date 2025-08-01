import useHandleLoadingDialog from "@/hooks/useHandleVerifyDialog";
import useTimerCountDown from "@/hooks/useTImerCountDown";
import { lokerinAPI } from "@/shared-api/config/api";
import { useProgress } from "@bprogress/next";
import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type SignUpRecruiterInput = {
  about: string;
  companyId: string;
  position: string;
  email: string;
  password: string;
  name: string;
  phone: unknown;
  avatarUrl: string;
};

const useSignUpRecruiter = () => {
  const setOpenDialog = useHandleLoadingDialog((state) => state.setOpenDialog);
  const { startTimer } = useTimerCountDown();
  const progress = useProgress();
  const router = useRouter();
  return useMutation({
    mutationFn: async (values: SignUpRecruiterInput) =>
      await lokerinAPI.post("/auth/recruiter/signup", values),
    onMutate: async () => {
      progress.start();
      setOpenDialog("signup", {
        description: "Processing...",
        isLoading: true,
      });
    },
    onSuccess: async (data, variables) => {
      startTimer(60);
      setOpenDialog("signup", {
        description: "Redirecting...",
        isSuccess: true,
        isLoading: false,
      });
      router.push("/auth/verify");
      useHandleLoadingDialog.getState().closeDialog();
    },
    onError: (error) => {
      setOpenDialog("signup", {
        description: "Failed to create account",
        isLoading: false,
        isError: true,
        isSuccess: false,
      });
      if (isAxiosError(error)) {
        toast.error(error.response?.data.message ?? "Failed to create account");
      } else toast.error("An unexpected error occurred");
    },
    onSettled: () => {
      progress.stop();
      useHandleLoadingDialog.getState().closeDialog();
    },
  });
};

export default useSignUpRecruiter;
