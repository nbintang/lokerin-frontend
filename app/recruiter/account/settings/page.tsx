"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import z from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { CameraIcon, CheckCircle, XCircle } from "lucide-react";
import { type FileWithPath, useDropzone } from "react-dropzone";
import {
  type FileWithPreview,
  ImageCropper,
} from "@/components/ui/image-croppper";
import { useRecruiterProfile } from "@/shared-api/hooks/recruiter-profile/useRecruiterProfile";
import { AsyncSelectRoles } from "@/components/ui/async-select-roles";
import { lokerinAPI } from "@/shared-api/config/api";
import { CommandItem } from "@/components/ui/command";
import { useUpdateRecruiterProfile } from "@/shared-api/hooks/recruiter-profile/useUpdateRecruiter";
import useUploadImage from "@/shared-api/hooks/media/useUploadImage";
import { zodImageSchema } from "@/schemas/imageSchema";

const accept = {
  "image/*": [],
};

const profileSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(50, "Name is too long")
    .optional(),
  email: z.email({ message: "Invalid email" }).optional(),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .max(20, "Phone number is too long")
    .optional(),
  avatar: zodImageSchema().optional(),
  about: z.string().max(500, "About section is too long").optional(),
  companyName: z
    .string()
    .min(1, "Company name is required")
    .max(100, "Company name is too long")
    .optional(),
  companyDescription: z
    .string()
    .max(300, "Company description is too long")
    .optional(),
  companyWebsite: z.string().url({ message: "Invalid website URL" }).optional(),
  positionName: z
    .string()
    .min(1, "Position name is required")
    .max(100, "Position name is too long"),
});

export default function Settings() {
  const { data: profile, isLoading, error } = useRecruiterProfile();
  const [selectedFile, setSelectedFile] = useState<FileWithPreview | null>(
    null
  );
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const uploadImage = useUploadImage({});
  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      avatar: "",
      about: "",
      companyName: "",
      companyDescription: "",
      companyWebsite: "",
      positionName: "",
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

  useEffect(() => {
    if (profile) {
      form.reset({
        name: profile.user.name,
        email: profile.user.email,
        phone: profile.user.phone,
        avatar: profile.user.avatarUrl,
        about: profile.about || "",
        companyName: profile.company.name,
        companyDescription: profile.company.description || "",
        companyWebsite: profile.company.website || "",
        positionName: profile.position.name,
      });
    }
  }, [profile, form]);

  const handleImageUpdate = useCallback(
    (base64: string | null) => {
      setCroppedImage(base64);
      form.setValue("avatar", base64 || "No File Selected");
      form.trigger("avatar");
    },
    [form]
  );

  const { mutate, isPending } = useUpdateRecruiterProfile();

  const onSubmit = async (data: z.infer<typeof profileSchema>) => {
    const { avatar, about, name, positionName } = data;
    const { secureUrl: avatarUrl } = await uploadImage.mutateAsync(
      avatar ?? ""
    );
    mutate({
      about: about || "",
      avatarUrl,
      name: name ?? "",
      position: positionName,
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">
            Loading profile information...
          </p>
        </CardContent>
      </Card>
    );
  }

  if (error || !profile) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">
            Failed to load profile information.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-1 flex-col md:gap-4 gap-2 py-4 mx-3 md:mx-5 md:py-6">
      <div className="w-full flex flex-col">
        <div>
          <h2 className="text-2xl font-semibold">Profile Settings</h2>
          <p className="text-muted-foreground">
            Manage your profile information and company details.
          </p>
        </div>

        {/* Profile Picture Section */}
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-2">Profile Picture</h3>
          <p className="text-muted-foreground text-sm">
            Upload a profile picture for your profile.
          </p>
          <div className="flex items-center gap-6 p-6 ">
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
                className="size-32 cursor-pointer relative"
              >
                <Input {...getInputProps()} />
                <div className="absolute top-0 left-0 w-full h-full bg-black opacity-0 hover:opacity-40 transition-opacity duration-300 z-10 flex items-center justify-center text-white">
                  <CameraIcon className="w-6 h-6" />
                </div>
                <AvatarImage
                  src={
                    profile.user.avatarUrl ??
                    "/placeholder.svg?height=80&width=80"
                  }
                  alt={profile.user.name}
                />
                <AvatarFallback>{profile.user.name.charAt(0)}</AvatarFallback>
              </Avatar>
            )}
            <div className="flex-1 ">
              <p className="font-medium">{profile.user.name}</p>
              <p className="text-sm text-muted-foreground">
                {profile.user.email}
              </p>
              <div className="flex items-center gap-2 mt-3">
                {profile.user.isVerified ? (
                  <Badge variant="secondary" className="text-xs">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-xs">
                    <XCircle className="w-3 h-3 mr-1" />
                    Not Verified
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="mt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormDescription>
                          Your full name as it appears on official documents.
                        </FormDescription>
                        <FormControl>
                          <Input
                            placeholder="Your Name"
                            type="text"        disabled={form.formState.isSubmitting || isPending}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormDescription>
                          Your primary email address for account notifications.
                        </FormDescription>
                        <FormControl>
                          <Input
                            placeholder="john.doe@example.com"
                            disabled
                            type="email"
                            className="disabled:cursor-not-allowed"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormDescription>
                        Your contact phone number for important communications.
                      </FormDescription>
                      <FormControl>
                        <Input
                          placeholder="+1 (555) 123-4567"
                          type="tel"
                          disabled
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="about"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>About</FormLabel>
                      <FormDescription>
                        Tell us about yourself, your experience, and what you're
                        looking for.
                      </FormDescription>
                      <FormControl>
                        <Textarea
                          placeholder="Write a brief description about yourself..."
                          rows={4}
                          className="resize-none h-[150px]"
                          cols={50}        disabled={form.formState.isSubmitting || isPending}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />{" "}
                <FormField
                  control={form.control}
                  name="positionName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel >
                        Position
                      </FormLabel>
                      <FormDescription>
                        Your position at the company.
                      </FormDescription>
                      <FormControl>
                        <AsyncSelectRoles<{
                          id: string;
                          name: string;
                          createdAt: string;
                          updatedAt: string;
                        }>
                          fetcher={async (query, page = 1, limit = 10) => {
                            const response = await lokerinAPI.get<{
                              roles: Array<{
                                id: string;
                                name: string;
                                createdAt: string;
                                updatedAt: string;
                              }>;
                              page: number;
                              limit: number;
                              total: number;
                            }>(`/roles`, {
                              params: {
                                name: query,
                                page,
                                limit,
                              },
                            });
                            return response.data;
                          }}
                          renderOption={(role) => (
                            <div className="flex flex-col">
                              <span className="font-medium">{role.name}</span>
                            </div>
                          )}
                          getOptionValue={(role) => role.name}
                          getDisplayValue={(role) => (
                            <div className="flex items-center gap-2 text-left">
                              <div className="font-medium">{role.name}</div>
                            </div>
                          )}
                          notFound={(name, onSelect) => (
                            <div className="flex justify-center items-center flex-col h-[90px]">
                              <div className="text-xs text-muted-foreground">
                                Role "{name}" not found
                              </div>
                              <CommandItem
                                className="!bg-transparent justify-center"
                                onSelect={() => onSelect(name)}
                              >
                                <Button variant="ghost">Create new role</Button>
                              </CommandItem>
                            </div>
                          )}
                          label="Position"
                          placeholder="Search position..."
                          pageSize={10}
                          queryKey="roles"
                           disabled={form.formState.isSubmitting || isPending}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Company Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Company Information</h3>
                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name</FormLabel>
                      <FormDescription>
                        The official name of your company or organization.
                      </FormDescription>
                      <FormControl>
                        <Input
                          placeholder="Acme Corporation"
                          type="text"
                          disabled
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="companyDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Description</FormLabel>
                      <FormDescription>
                        A brief description of what your company does and its
                        mission.
                      </FormDescription>
                      <FormControl>
                        <Textarea
                          placeholder="Describe your company's mission and services..."
                          className="min-h-[80px]"
                          disabled
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="companyWebsite"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Website</FormLabel>
                      <FormDescription>
                        Your company's official website URL.
                      </FormDescription>
                      <FormControl>
                        <Input
                          placeholder="https://www.example.com"
                          type="url"
                          disabled
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Account Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Account Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                  <div>
                    <span className="font-medium">Profile Created:</span>{" "}
                    {format(new Date(profile.createdAt), "dd MMMM yyyy")}
                  </div>
                  <div>
                    <span className="font-medium">Last Updated:</span>{" "}
                    {format(new Date(profile.updatedAt), "dd MMMM yyyy")}
                  </div>
                  <div>
                    <span className="font-medium">User Account Created:</span>{" "}
                    {format(new Date(profile.user.createdAt), "dd MMMM yyyy")}
                  </div>
                  <div>
                    <span className="font-medium">Company Joined:</span>{" "}
                    {format(
                      new Date(profile.company.createdAt),
                      "dd MMMM yyyy"
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {form.formState.isDirty && (
                <div className="flex gap-4 pt-4 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    className="font-semibold bg-transparent"
                    onClick={() => form.reset()}
                    disabled={form.formState.isSubmitting || isPending}
                  >
                    Cancel Changes
                  </Button>
                  <Button
                    type="submit"
                    disabled={form.formState.isSubmitting || isPending}
                    className="font-semibold"
                  >
                    {isPending ? "Saving changes..." : "Save Changes"}
                  </Button>
                </div>
              )}
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
