 
import { lokerinAPI } from "@/shared-api/config/api";
import { base64ToFile } from "@/shared-api/helpers/base64ToFile";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "sonner";
export type UploadImageApiResponse = {
  secureUrl: string;
  publicId: string;
  createdAt: Date | null;
};
type PostImageProps = {
  folder: "lokerin_cv" | "lokerin_image";
  existedUrl?: string | null;
} & Omit<
  UseMutationOptions<
    UploadImageApiResponse,
    unknown,
    File | string | null,
    unknown
  >,
  "mutationFn" | "mutationKey" | "onError"
>;

const useUploadImage = ({ folder, existedUrl, ...options }: PostImageProps) => {
  return useMutation({
    mutationKey: [folder],
    mutationFn: async (
      file: File | string | null
    ): Promise<UploadImageApiResponse> => {
      const formData = new FormData();
      if (!file)
        return { secureUrl: existedUrl ?? "", publicId: "", createdAt: null };
      let convertedFile: File;
      const isBase64String =
        typeof file === "string" && file.startsWith("data:image/");
      if (isBase64String) {
        convertedFile = base64ToFile(file, "image.png");
      } else if (file instanceof File) {
        convertedFile = file;
      } else {
        return {
          secureUrl: file,
          publicId: "",
          createdAt: null,
        };
      }
      formData.append("file", convertedFile);
      const profileResponse = await lokerinAPI.post(
        "/upload",
        formData,
        {
          params: {
            folder,
            existedUrl: existedUrl ?? null,
          },
        }
      );
      const data = profileResponse.data.data;
      return data as UploadImageApiResponse;
    },
    onError: async (err) => {
      if (isAxiosError(err)) {
        toast.error(err.response?.data.message ?? "Failed to upload image");
      } else toast.error("An unexpected error occurred");
    },
    ...options,
  });
};

export default useUploadImage;
