"use client";
import { useHandleAiFeaturesDialog } from "@/hooks/useHandleCvUploadDialog";
import React from "react";
import { useShallow } from "zustand/shallow";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadItemProgress,
  FileUploadList,
  FileUploadTrigger,
} from "./ui/file-upload";
import { CloudUpload, X } from "lucide-react";
import { Button } from "./ui/button";
import { IconSparkles } from "@tabler/icons-react";

const FILE_SIZE = 5 * 1024 * 1024; // 5MB
const formSchema = z.object({
  files: z
    .array(z.custom<File>())
    .min(1, "Please select at least one file")
    .max(1, "You can only upload one file")
    .refine((files) => files.every((file) => file.size <= FILE_SIZE), {
      message: "File size must be less than 5MB",
      path: ["files"],
    }),
});

type FormValues = z.infer<typeof formSchema>;
const AiFeaturesDialog = () => {
  const { isOpen, setOpen } = useHandleAiFeaturesDialog(
    useShallow((state) => ({
      isOpen: state.isOpen,
      setOpen: state.setOpen,
    }))
  );
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      files: [],
    },
  });

  const onSubmit = React.useCallback((data: FormValues) => {
    console.log(data);
    console.log(data.files);
  }, []);
  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent className="w-full max-w-6xl h-[50vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="sr-only hidden" />
          <div className="flex items-center justify-center md:justify-start md:text-left gap-2">
            <IconSparkles />
            <h2>AI Features</h2>
          </div>
          <DialogDescription>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit.
            Repudiandae eaque quae tempore!
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex-1 flex flex-col space-y-4 overflow-auto"
          >
            <FormField
              control={form.control}
              name="files"
              render={({ field }) => (
                <FormItem className="flex-1 flex flex-col">
                  <FormControl className="flex-1">
                    <FileUpload
                      value={field.value}
                      onValueChange={field.onChange}
                      accept="application/pdf"
                      maxFiles={1}
                      maxSize={5 * 1024 * 1024}
                      onFileReject={(_, message) => {
                        form.setError("files", {
                          message,
                        });
                      }}
                      className="cursor-pointer w-full"
                      multiple
                    >
                      <FileUploadDropzone className="flex-1  text-muted-foreground flex flex-col sm:flex-row justify-center items-center border-dotted text-center">
                        <CloudUpload className="size-4" />
                        Drag and drop or
                        <FileUploadTrigger asChild>
                          <Button variant="link" size="sm" className="p-0">
                            choose resume files
                          </Button>
                        </FileUploadTrigger>
                        to upload
                      </FileUploadDropzone>
                      <FileUploadList>
                        {field.value.map((file, index) => (
                          <FileUploadItem key={index} value={file}>
                            <FileUploadItemPreview />
                            <FileUploadItemMetadata />
                            <FileUploadItemDelete asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="size-7"
                              >
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
                  {form.formState.errors.files && <FormMessage />}
                </FormItem>
              )}
            />
            <Button type="submit" className="mt-2">
              <IconSparkles /> Find Reccomended Jobs
            </Button>
            <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
              <span className="bg-background text-muted-foreground relative z-10 px-2">
                Or
              </span>
            </div>
            <Button type="button"  variant="outline">
              <IconSparkles /> Try Use Resume From Your Profile
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AiFeaturesDialog;
