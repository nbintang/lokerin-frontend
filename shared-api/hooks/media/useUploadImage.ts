import { lokerinAPI } from "@/shared-api/config/api";
import { base64ToFile } from "@/shared-api/helpers/base64ToFile";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "sonner";
export type UploadImageApiResponse = {
  message: string;
  secureUrl: string;
  publicId: string;
  createdAt: Date | null;
};
type PostImageProps = {
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

const useUploadImage = ({ existedUrl, ...options }: PostImageProps) =>  useMutation({
    mutationKey: ["upload-image"],
    mutationFn: async (
      file: File | string | null
    ): Promise<UploadImageApiResponse> => {
      const formData = new FormData();
      if (!file)
        return {
          message: "",
          secureUrl: existedUrl ?? "",
          publicId: "",
          createdAt: null,
        };
      let convertedFile: File;
      const isBase64String =
        typeof file === "string" && file.startsWith("data:image/");
      if (isBase64String) {
        convertedFile = base64ToFile(file, "image.png");
      } else if (file instanceof File) {
        convertedFile = file;
      } else {
        return {
          message: "",
          secureUrl: file,
          publicId: "",
          createdAt: null,
        };
      }
      formData.append("image", convertedFile);
      const res = await lokerinAPI.post<UploadImageApiResponse>(
        "/upload/image",
        formData,
        {
          params: {
            folder: "lokerin_image",
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
export default useUploadImage;
