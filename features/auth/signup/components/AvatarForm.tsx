import { FileWithPreview, ImageCropper } from "@/components/ui/image-croppper";
import React, { useCallback, useState } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";
import { useForm, useFormContext } from "react-hook-form";
import { MediaSchema } from "../schema";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { CameraIcon } from "lucide-react";

const accept: Record<string, string[]> = {
  "image/*": [".png", ".jpg", ".jpeg"],
};
const AvatarForm = () => {
  const form = useFormContext<MediaSchema>();
  const [selectedFile, setSelectedFile] = useState<FileWithPreview | null>(
    null
  );
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
    const file = acceptedFiles[0];
    if (!file) {
      alert("Selected image is too large!");
      return;
    }
    const fileWithPreview = Object.assign(file, {
      preview: URL.createObjectURL(file),
    });
    setSelectedFile(fileWithPreview);
    setDialogOpen(true);
  }, []);
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept,
  });
  const handleImageUpdate = useCallback(
    (base64: string | null) => {
      setCroppedImage(base64);
      form.setValue("avatar", base64 || "No File Selected");
      form.trigger("avatar");
    },
    [form]
  );
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="font-medium">Upload your avatar (optional)</h2>
        <p className="text-sm text-muted-foreground">
          You can ignore this step, if you don't want to upload your avatar
        </p>
      </div>
      <div className="grid place-items-center">
        {selectedFile ? (
          <ImageCropper 
            size="32"
            croppedImage={croppedImage}
            setCroppedImage={handleImageUpdate}
            dialogOpen={isDialogOpen}
            setOpenDialog={setDialogOpen}
            selectedFile={selectedFile}
            setSelectedFile={setSelectedFile}
          />
        ) : (
          <Avatar
            {...getRootProps()}
            className="size-32 cursor-pointer relative "
          >
            <Input {...getInputProps()} />
            <div
              className={cn(
                "absolute top-0 left-0 w-full h-full bg-black  hover:opacity-40 transition-opacity duration-300 z-10 flex items-center justify-center text-white",
                selectedFile ? "opacity-50" : "opacity-70"
              )}
            >
              <CameraIcon className="w-6 h-6" />
            </div>
            <AvatarImage
              src={
                "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
              }
              alt={"Avatar"}
            />
            <AvatarFallback>{"?"}</AvatarFallback>
          </Avatar>
        )}
      </div>
    </div>
  );
};

export default AvatarForm;
