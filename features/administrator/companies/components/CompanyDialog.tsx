"use client";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  accept,
  FileWithPreview,
  ImageCropper,
} from "@/components/ui/image-croppper";
import { companySchema, CompanySchema } from "../schema";
import { FileWithPath, useDropzone } from "react-dropzone";
import { FormDialogLayout } from "@/components/layouts/FormDialogLayout";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { CameraIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useCompanyDialogStore } from "../hooks/useCompanyDialogStore";
import { useShallow } from "zustand/shallow";
import { format } from "date-fns";
import { useCreateCompany } from "@/shared-api/hooks/companies/useCreateCompany";
import { useUpdateCompany } from "@/shared-api/hooks/companies/useUpdateCompany";
import useUploadImage from "@/shared-api/hooks/media/useUploadImage";

export const CompanyDialog = () => {
  const { isOpen, data, mode, close } = useCompanyDialogStore(
    useShallow((state) => ({
      isOpen: state.isOpen,
      data: state.data,
      mode: state.mode,
      close: state.close,
    }))
  );

  const [selectedFile, setSelectedFile] = useState<FileWithPreview | null>(
    null
  );
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [isCropperOpen, setCropperOpen] = useState(false);
  const form = useForm<CompanySchema>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      id: data?.id || "",
      name: data?.name || "",
      description: data?.description || "",
      logoUrl: data?.logoUrl || "",
      website: data?.website || "",
    },
  });
  const { mutate: createCompany, ...createCompanyState } = useCreateCompany();
  const { mutate: updateCompany, ...updateCompanyState } = useUpdateCompany(
    form.getValues("id") || ""
  );
  const { mutateAsync: uploadImage } = useUploadImage({
    existedUrl: mode === "edit" ? form.getValues("logoUrl") : null,
  });
  useEffect(() => {
    if (data) {
      form.reset({
        id: data.id || "",
        name: data.name || "",
        description: data.description || "",
        logoUrl: data.logoUrl || "",
        website: data.website || "",
      });
    }
  }, [data, form]);

  const handleImageUpdate = useCallback(
    (base64: string | null) => {
      setCroppedImage(base64);
      form.setValue("logoUrl", base64 || "");
      form.trigger("logoUrl");
    },
    [form]
  );

  const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const fileWithPreview = Object.assign(file, {
      preview: URL.createObjectURL(file),
    });
    setSelectedFile(fileWithPreview);

    setCropperOpen(true);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept,
  });
  const onSubmit = async (formData: CompanySchema) => {
    const { logoUrl, id, ...rest } = formData;
    const { secureUrl } = await uploadImage(formData.logoUrl ?? "");
    if (mode === "edit") {
      updateCompany({
        ...rest,
        id: id || "",
        logoUrl: secureUrl,
      });
    }
    if (mode === "create") {
      createCompany({
        ...rest,
        logoUrl: secureUrl,
      });
    }

    close();
    setSelectedFile(null);
    setCroppedImage(null);
    form.reset();
  };

  const isSubmitting =
    form.formState.isSubmitting ||
    createCompanyState.isPending ||
    updateCompanyState.isPending;
  return (
    <FormDialogLayout
      isOpen={isOpen}
      onOpenChange={close}
      title={mode === "edit" ? "Edit Company" : "Create Company"}
      description="Manage your company information"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            {/* Image Upload Section */}
            <div className="flex items-center justify-center gap-6 p-6">
              {selectedFile ? (
                <ImageCropper
                  size="32"
                  croppedImage={croppedImage}
                  setCroppedImage={handleImageUpdate}
                  dialogOpen={isCropperOpen}
                  setOpenDialog={setCropperOpen}
                  selectedFile={selectedFile}
                  setSelectedFile={setSelectedFile}
                />
              ) : (
                <Avatar
                  {...getRootProps()}
                  className="size-32 cursor-pointer relative"
                >
                  <Input {...getInputProps()} />
                  <div className="absolute top-0 left-0 w-full h-full bg-black opacity-0 hover:opacity-40 transition-opacity duration-300 z-10 flex items-center justify-center text-white">
                    <CameraIcon className="w-6 h-6" />
                  </div>
                  <AvatarImage
                    src={data?.logoUrl || "/placeholder.svg?height=80&width=80"}
                    alt={data?.name || "Company"}
                  />
                  <AvatarFallback>
                    {data?.name?.charAt(0) || "N/A"}
                  </AvatarFallback>
                </Avatar>
              )}
            </div>

            {/* Form Fields */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter company name"
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter company name"
                      className="resize-none min-h-[100px]"
                      rows={4}
                      cols={50}
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Website</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter company website"
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-between flex-wrap-reverse flex-row-reverse">
              <p className="text-xs text-muted-foreground">
                {data.updatedAt && (
                  <>
                    Updated At:{" "}
                    {format(new Date(data.updatedAt), "dd MMM, yyyy")}
                  </>
                )}
              </p>
              <p className="text-xs text-muted-foreground">
                {data.createdAt && (
                  <>
                    Created At:{" "}
                    {format(new Date(data.createdAt), "dd MMM, yyyy")}
                  </>
                )}
              </p>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                disabled={isSubmitting}
                onClick={close}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className=" animate-spin" />
                    Saving...
                  </>
                ) : (
                  `${mode === "edit" ? "Update" : "Create"} Company`
                )}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </FormDialogLayout>
  );
};
