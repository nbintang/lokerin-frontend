import React from "react";
import { useForm, useFormContext } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadList,
  FileUploadTrigger,
} from "@/components/ui/file-upload";
import { cn } from "@/lib/utils";
import { CloudUpload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MediaSchema } from "../schema";

const ResumeForm = () => {
  const form = useFormContext<MediaSchema>();
  return (
    <FormField
      control={form.control}
      name="cv"
      render={({ field }) => (
        <FormItem className="flex-1 flex flex-col">
          <FormLabel className="after:content-['*'] after:ml-1 after:text-red-500"> Upload your Cv  </FormLabel>
          <FormDescription>
            If you are Job Seeker, Please upload your CV{" "}
          </FormDescription>
          <FormControl className="flex-1 flex flex-col">
            <FileUpload
              value={field.value}
              onValueChange={field.onChange}
              accept="application/pdf"
              maxFiles={1}
              maxSize={5 * 1024 * 1024}
              onFileReject={(_, message) => {
                form.setError("cv", {
                  message,
                });
              }}
              className={cn(
                " w-full",
                form.formState.isValid ? "cursor-not-allowed" : "cursor-pointer"
              )}
              multiple
              disabled={form.formState.isDirty || form.formState.isSubmitting}
            >
              <FileUploadDropzone className="flex-1  text-muted-foreground flex flex-col sm:flex-row justify-center items-center border-dotted text-center">
                <CloudUpload className="size-4" />
                Drag and drop or
                <FileUploadTrigger asChild>
                  <Button variant={"link"} size="sm" className="p-0 ">
                    choose resume files
                  </Button>
                </FileUploadTrigger>
                to upload
              </FileUploadDropzone>
              <FileUploadList>
                {field.value?.map((file, index) => (
                  <FileUploadItem key={index} value={file}>
                    <FileUploadItemPreview />
                    <FileUploadItemMetadata />
                    <FileUploadItemDelete asChild>
                      <Button variant="ghost" size="icon" className="size-7">
                        <X />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </FileUploadItemDelete>
                  </FileUploadItem>
                ))}
              </FileUploadList>
            </FileUpload>
          </FormControl>
          {/* <FormDescription>
                              Upload up to 2 images up to 5MB each.
                            </FormDescription> */}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ResumeForm;
