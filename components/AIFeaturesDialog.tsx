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
} from "../components/ui/dialog";
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
  FileUploadList,
  FileUploadTrigger,
} from "../components/ui/file-upload";
import { CloudUpload, Loader2, X } from "lucide-react";
import { Button } from "../components/ui/button";
import { IconSparkles } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { useRecommendJobs } from "@/shared-api/hooks/jobs/useRecommendJobs";
import { useProfile } from "@/shared-api/hooks/profile/useProfile";
import { zodResumeSchema } from "@/schemas/resumeSchema";
import { AuroraText } from "../components/magicui/aurora-text";
import { SparklesText } from "../components/magicui/sparkles-text";

const FILE_SIZE = 5 * 1024 * 1024; // 5MB
const formSchema = z.object({
  files: zodResumeSchema(FILE_SIZE),
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

  const [isClicking, setIsClicking] = useState<boolean>(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      files: [],
    },
  });
  const { data: profile, isLoading } = useProfile();
  const { mutateAsync, isPending } = useRecommendJobs();
  const isOperationInProgress =
    isPending || isClicking || form.formState.isSubmitting;
  const handleClickOwnResume = async () => {
    setIsClicking(true);
    try {
      await mutateAsync({
        resumeUrl: profile?.cvUrl,
        minScore: 0.43,
      });
      form.reset();
      setOpen(true);
    } catch (error) {
      setIsClicking(false);
    }
  };
  const onSubmit = React.useCallback(
    async (data: FormValues) => {
      const resumeFile = data.files[0];
      const minScore = data.minScore;
      try {
        await mutateAsync({ resumeFile, minScore });
        form.reset();
        setOpen(false);
      } catch (error) {
        console.error(error);
      }
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
            <SparklesText>
              <IconSparkles className="text-sky-400" />
            </SparklesText>
            <AuroraText colors={["#38bdf8", "#4f46e5", "#0ea5e9"]}>
              AI Recommendation
            </AuroraText>
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
                  {(isPending || form.formState.isSubmitting) && !isClicking ? (
                    <div className="grid place-items-center h-full w-full">
                      <div className="flex flex-col items-center gap-4 animate-fade-in">
                        <Loader2 className="animate-spin  text-sky-700 size-10" />
                        <AuroraText
                          colors={["#38bdf8", "#4f46e5", "#0ea5e9"]}
                          className="text-muted-foreground text-base tracking-wide text-center"
                        >
                          Analyzing, please wait...
                        </AuroraText>
                      </div>
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
                            form.formState.isValid || isOperationInProgress
                              ? "cursor-not-allowed"
                              : "cursor-pointer"
                          )}
                          multiple
                          disabled={
                            form.formState.isValid || isOperationInProgress
                          }
                        >
                          <FileUploadDropzone
                            className={cn(
                              "flex-1  text-muted-foreground flex flex-col sm:flex-row justify-center items-center border-dotted text-center",
                              isPending ? "opacity-50 pointer-events-none" : ""
                            )}
                          >
                            <CloudUpload className="size-4" />
                            Drag and drop or
                            <FileUploadTrigger asChild>
                              <AuroraText
                                colors={["#38bdf8", "#4f46e5", "#0ea5e9"]}
                                className="text-sm"
                              >
                                choose resume files
                              </AuroraText>
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
              {form.formState.isSubmitting || (isPending && !isClicking) ? (
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
              variant="outline"
              type="button"
              onClick={handleClickOwnResume}
              disabled={isOperationInProgress || form.formState.isValid}
            >
              {isClicking && !form.formState.isSubmitting ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin text-sky-400" />
                  <AuroraText
                    colors={["#38bdf8", "#4f46e5", "#0ea5e9"]}
                    className="text-sm"
                  >
                    Analyzing
                  </AuroraText>
                </>
              ) : (
                <>
                  <IconSparkles className="text-sky-400 size-4" />
                  <AuroraText
                    colors={["#38bdf8", "#4f46e5", "#0ea5e9"]}
                    className="text-sm"
                  >
                    Try Use Resume From Your Profile
                  </AuroraText>
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
