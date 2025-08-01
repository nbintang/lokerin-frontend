"use client";
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
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  CameraIcon,
  LoaderCircleIcon,
  CloudUpload,
  Loader2,
  X,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { zodImageSchema } from "@/schemas/imageSchema";
import { resumeSchema } from "@/schemas/resumeSchema";
import { FileWithPreview, ImageCropper } from "@/components/ui/image-croppper";
import { useCallback, useState } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
const accept: Record<string, string[]> = {
  "image/*": [".png", ".jpg", ".jpeg"],
};
const signUpSchema = z
  .object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.url(),
    phone: z.number(),
    password: z.string().regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, {
      message:
        "Password must be at least 8 characters long and contain at least one letter and one number",
    }),
    confirmPassword: z.string(),
    avatar: zodImageSchema().optional(),
    cv: resumeSchema().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
type SignUpForm = z.infer<typeof signUpSchema>;
export default function SignUpForm() {
  const [selectedFile, setSelectedFile] = useState<FileWithPreview | null>(
    null
  );
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const form = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: 0,
      avatar: "",
      cv: undefined,
    },
  });

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
  const onSubmit = (data: SignUpForm) => {
    console.log(data);
  };
  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
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
                alt={form.getValues("firstName")}
              />
              <AvatarFallback>{"?"}</AvatarFallback>
            </Avatar>
          )}
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem className="grid relative ">
                <FormControl>
                  <Input
                    id="firstName"
                    placeholder="Enter your First Name"
                    type="text"
                    {...field}
                  />
                </FormControl>
                <span className="absolute right-2  bottom-0 text-red-500 text-lg">
                  *
                </span>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem className="relative">
                <FormControl>
                  <Input
                    id="lastName"
                    placeholder="Enter your Last Name "
                    type="text"
                    {...field}
                  />
                </FormControl>
                <span className="absolute right-2  bottom-0 text-red-500 text-lg">
                  *
                </span>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="grid gap-3 relative">
                <FormControl>
                  <Input
                    id="email"
                    placeholder="Enter your email"
                    type="email"
                    {...field}
                  />
                </FormControl>
                <span className="absolute right-2  bottom-0 text-red-500 text-lg">
                  *
                </span>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem className="grid gap-3 relative">
                <FormControl>
                  <Input
                    id="phone"
                    placeholder="08xxxxxxxx"
                    type="tel"
                    {...field}
                  />
                </FormControl>
                <span className="absolute right-2  bottom-0 text-red-500 text-lg">
                  *
                </span>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="grid gap-3 relative">
                <FormControl>
                  <Input
                    id="password"
                    placeholder="Enter your password"
                    type="password"
                    {...field}
                  />
                </FormControl>
                <span className="absolute right-2  bottom-0 text-red-500 text-lg">
                  *
                </span>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="grid gap-3">
                <FormLabel htmlFor="confirmPassword">
                  Confirm Password
                </FormLabel>
                <FormControl>
                  <Input
                    id="password"
                    placeholder="********"
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="cv"
            render={({ field }) => (
              <FormItem className="flex-1 flex flex-col">
 
                  <>
                    <FormControl className="flex-1">
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
                          form.formState.isValid
                            ? "cursor-not-allowed"
                            : "cursor-pointer"
                        )}
                        multiple
                        disabled={
                          form.formState.isDirty || form.formState.isSubmitting
                        }
                      >
                        <FileUploadDropzone className="flex-1  text-muted-foreground flex flex-col sm:flex-row justify-center items-center border-dotted text-center">
                          <CloudUpload className="size-4" />
                          Drag and drop or
                          <FileUploadTrigger asChild>
                            <Button
                            variant={"link"}
                              size="sm"
                              className="p-0 "
                            >
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
         
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full"
            disabled={form.formState.isSubmitting}
          >
            {!form.formState.isSubmitting ? (
              "Sign up"
            ) : (
              <span className="flex items-center gap-2">
                Signing up
                <LoaderCircleIcon className="animate-spin" />
              </span>
            )}
          </Button>
        </form>
      </Form>
    </>
  );
}
