import { lokerinAPI } from "@/shared-api/config/api";
import { base64ToFile } from "@/shared-api/helpers/base64ToFile";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "sonner";
export type UploadDocumentApiResponse = {
  message: string;
  secureUrl: string;
  publicId: string;
  createdAt: Date | null;
};
type PostDocumentProps = {
  existedUrl?: string | null;
} & Omit<
  UseMutationOptions<
    UploadDocumentApiResponse,
    unknown,
    File | string | null,
    unknown
  >,
  "mutationFn" | "mutationKey" | "onError"
>;

const useUploadDocument = ({ existedUrl, ...options }: PostDocumentProps) => {
  return useMutation({
    mutationKey: ["upload-document"],
    mutationFn: async (
      file: File | string | null
    ): Promise<UploadDocumentApiResponse> => {
      const formData = new FormData();
      formData.append("document", file as File);
      const res = await lokerinAPI.post<UploadDocumentApiResponse>(
        "/upload/document",
        formData,
        {
          params: {
            folder: "lokerin_cv",
            existedUrl: existedUrl ?? null,
          },
        }
      );
      return res.data;
    },
    onError: async (err) => {
      if (isAxiosError(err)) {
        toast.error(err.response?.data.message ?? "Failed to upload image");
      } else toast.error("An unexpected error occurred");
    },
    ...options,
  });
};

export default useUploadDocument;
