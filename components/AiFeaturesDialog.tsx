"use client";
import { useHandleAiFeaturesDialog } from "@/hooks/useHandleCvUploadDialog";
import React, { useState } from "react";
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
import { CloudUpload, Loader2, LoaderCircleIcon, X } from "lucide-react";
import { Button } from "./ui/button";
import { IconSparkles } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { useRecommendJobs } from "@/shared-api/hooks/jobs/useRecommendJobs";
import { useProfile } from "@/shared-api/hooks/profile/useProfile";
import { useRecommendationJobStore } from "@/shared-api/stores/useRecommendationJobStore";
import { useRouter } from "next/navigation";

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
  minScore: z.number().min(0).max(1).default(0.43).optional(),
});

type FormValues = z.infer<typeof formSchema>;
const AIFeaturesDialog = () => {
  const { isOpen, setOpen } = useHandleAiFeaturesDialog(
    useShallow((state) => ({
      isOpen: state.isOpen,
      setOpen: state.setOpen,
    }))
  );
  const router = useRouter();
  const setJobRes = useRecommendationJobStore((s) => s.setJobRes);
  const [isClicking, setIsClicking] = useState<boolean>(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      files: [],
    },
  });
  const { data: profile, isPending, isError } = useProfile();
  const { mutateAsync } = useRecommendJobs(); 
  const isOperationInProgress = isPending || isClicking || form.formState.isSubmitting;
  
  const handleClickOwnResume = async () => {
    setIsClicking(true);
    await mutateAsync({
      resumeUrl: profile?.cvUrl,
      minScore: 0.43,
    });
    router.push("/applier/dashboard/jobs/recommendation-results");
    setIsClicking(false);
    setOpen(false);
  };
  const onSubmit = React.useCallback(
    async (data: FormValues) => {
      const resumeFile = data.files[0];
      const minScore = data.minScore;
      await mutateAsync({ resumeFile, minScore });
      setOpen(false);
    },
    [mutateAsync]
  );

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent
        className="w-full max-w-6xl h-[50vh] flex flex-col"
        onInteractOutside={(e) => {
          if (isOperationInProgress) {
            e.preventDefault();
          }
        }}
        showCloseButton={isOperationInProgress ? false : true}
        onEscapeKeyDown={(e) => {
          if (isOperationInProgress) {
            e.preventDefault();
          }
        }}
      >
        <DialogHeader>
          <DialogTitle className="sr-only hidden" />
          <div
            className={cn(
              "flex items-center justify-center md:justify-start md:text-left gap-2"
            )}
          >
            <IconSparkles className="text-sky-400" />
            <h2
              className={cn(
                "bg-gradient-to-br from-sky-400 to-indigo-600 bg-clip-text text-transparent"
              )}
            >
              AI Recommendation
            </h2>
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
                  {isPending ||
                  isClicking ||
                  isError ||
                  form.formState.isSubmitting ? (
                    <div className="grid place-items-center h-full w-full">
                      <LoaderCircleIcon className="size-12 animate-spin text-sky-400" />
                    </div>
                  ) : (
                    <>
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
                          className={cn(
                            " w-full",
                            form.formState.isValid
                              ? "cursor-not-allowed"
                              : "cursor-pointer"
                          )}
                          multiple
                          disabled={
                            form.formState.isDirty ||
                            form.formState.isSubmitting
                          }
                        >
                          <FileUploadDropzone className="flex-1  text-muted-foreground flex flex-col sm:flex-row justify-center items-center border-dotted text-center">
                            <CloudUpload className="size-4" />
                            Drag and drop or
                            <FileUploadTrigger asChild>
                              <Button
                                size="sm"
                                className="p-0 bg-gradient-to-br from-sky-400 to-indigo-600 bg-clip-text text-transparent hover:bg-gradient-to-br hover:from-sky-500 hover:to-indigo-700 duration-500 ease-in-out"
                              >
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
                      <FormMessage />
                    </>
                  )}
                </FormItem>
              )}
            />
            <Button
              type="submit"
              variant={"special"}
              className="mt-2"
              disabled={isOperationInProgress}
            >
              {form.formState.isSubmitting || isPending ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" /> Submitting
                </>
              ) : (
                <>
                  <IconSparkles /> Find Reccomended Jobs
                </>
              )}
            </Button>
            <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
              <span className="bg-background text-muted-foreground relative z-10 px-2">
                Or
              </span>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={handleClickOwnResume}
              disabled={
         isOperationInProgress ||
                form.formState.isValid
              }
            >
              {form.formState.isSubmitting || isClicking ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" /> Analyzing
                </>
              ) : (
                <>
                  <IconSparkles className="text-sky-400" />{" "}
                  <p
                    className={cn(
                      "bg-gradient-to-br from-sky-400 to-indigo-600 bg-clip-text text-transparent"
                    )}
                  >
                    Try Use Resume From Your Profile
                  </p>
                </>
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AIFeaturesDialog;
