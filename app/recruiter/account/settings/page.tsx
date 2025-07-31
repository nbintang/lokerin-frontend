"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { useProfile } from "@/shared-api/hooks/profile/useProfile";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import Link from "next/link";
import { CameraIcon, FileSymlink } from "lucide-react";
import { FileWithPath, useDropzone } from "react-dropzone";
import { FileWithPreview, ImageCropper } from "@/components/ui/image-croppper";
import { useRecruiterProfile } from "@/shared-api/hooks/recruiter-profile/useRecruiterProfile";

const accept = {
  "image/*": [],
};

const profileSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(50, "Name is too long")
    .optional(),
  email: z.email({ message: "Invalid email" }),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .max(20, "Phone number is too long"),
  avatarUrl: z.url({ message: "Invalid URL" }).optional(), 
});

export default function Settings() {
  const { data: profile, isLoading, error } = useRecruiterProfile();
  const [selectedFile, setSelectedFile] = useState<FileWithPreview | null>(
    null
  );
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: profile?.user.name || "",
      email: profile?.user.email || "",
      phone: profile?.user.phone || "",
      avatarUrl: profile?.user.avatarUrl || "",
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
        avatarUrl: profile.user.avatarUrl,
      });
    }
  }, [profile, form]);
  const handleImageUpdate = useCallback(
    (base64: string | null) => {
      setCroppedImage(base64);
      form.setValue("avatarUrl", base64 || "No File Selected");
      form.trigger("avatarUrl");
    },
    [form]
  );
  const onSubmit = (data: z.infer<typeof profileSchema>) => {
    console.log(data);
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
    <div className="flex flex-1 flex-col  md:gap-4 gap-2 py-4 mx-3 md:mx-5  md:py-6">
      <div className="w-full flex flex-col">
        <div>
          <h2 className="text-2xl font-semibold">Profile Picture</h2>
          <p className="text-muted-foreground">
            Upload a profile picture to personalize your account.
          </p>
        </div>
        <div className="flex w-full justify-start space-y-4 p-6">
          {selectedFile ? (
            <ImageCropper
              size="44"
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
              className="size-44 cursor-pointer relative "
            >
              <Input {...getInputProps()} />
              <div className="absolute top-0 left-0 w-full h-full bg-black opacity-0 hover:opacity-40 transition-opacity duration-300 z-10 flex items-center justify-center text-white">
                <CameraIcon className="w-6 h-6" />
              </div>
              <AvatarImage
                src={profile.user.avatarUrl ?? "/images/question-mark.jpg"}
                alt={"@shadcn"}
              />
              <AvatarFallback>{profile.user.name.charAt(0)}</AvatarFallback>
            </Avatar>
          )}
        </div>
        <div className="p-2 pt-0    ">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-9">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormDescription>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Magni repudiandae consequatur ea?
                      </FormDescription>
                      <FormControl>
                        <Input
                          placeholder="Your Name"
                          type="text"
                          className=" "
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
                      <FormLabel>Email</FormLabel>
                      <FormDescription>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Magni repudiandae consequatur ea?
                      </FormDescription>
                      <FormControl>
                        <Input
                          placeholder="Johndoe@mail.com"
                          disabled
                          type="email"
                          className="   disabled:cursor-not-allowed"
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
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Magni repudiandae consequatur ea?
                    </FormDescription>
                    <FormControl>
                      <Input
                        placeholder="08xxx-xxxx-xxxx"
                        disabled
                        type="tel"
                        className=" disabled:cursor-not-allowed"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="text-muted-foreground text-xs">
                  Created At: {format(profile.createdAt, "dd MMMM yyyy")}
                </div>
                <div className="text-muted-foreground text-xs">
                  Updated At: {format(profile.updatedAt, "dd MMMM yyyy")}
                </div>
              </div>
              {form.formState.isDirty && (
                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="secondary"
                    className="font-semibold py-2"
                    onClick={() => form.reset()}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="font-semibold py-2">
                    Save Changes
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
