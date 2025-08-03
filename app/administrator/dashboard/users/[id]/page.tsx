"use client";
import ProfileSkeleton from "@/components/ProfileSkeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import useHandleWarningDialog from "@/hooks/useHandleWarningDialog";
import { useDeleteUser } from "@/shared-api/hooks/users/useDeleteUser";
import { useUser } from "@/shared-api/hooks/users/useUser";
import { format } from "date-fns";
import {
  CalendarDays,
  Mail,
  Phone,
  Shield,
  ShieldCheck,
  FileText,
  Download,
  User,
  Briefcase,
  Trash2,
} from "lucide-react";
import { use } from "react";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: user, isLoading, error } = useUser(id);
  const setOpenDeleteDialog = useHandleWarningDialog(
    (state) => state.setOpenDialog
  );
  const { mutate } = useDeleteUser(id);
  const handleDeleteUser = () =>
    setOpenDeleteDialog({
      isOpen: true,
      title: "Delete User",
      description: "Are you sure you want to delete this user?",
      onConfirm: () => mutate(),
    });
  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (error || !user) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">
            Failed to load user information.
          </p>
        </CardContent>
      </Card>
    );
  }

  const getRoleBadgeVariant = (role: string) => {
    return role === "RECRUITER" ? "secondary" : "outline";
  };

  const getRoleIcon = (role: string) => {
    return role === "RECRUITER" ? Briefcase : User;
  };

  return (
    <>
      <div className="relative z-0">
        <div
          className="h-24 md:h-36 mx-0.5 overflow-hidden"
          style={{
            backgroundImage: user.avatarUrl
              ? `url(${user.avatarUrl})`
              : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-white/40 dark:bg-black/80" />
      </div>

      <div className="container mx-auto">
        <Card className="bg-background rounded-none border-0 border-none shadow-none">
          <CardContent className="p-0">
            <div className="px-4 sm:px-6 pb-4">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between sm:space-x-4 -mt-16 sm:-mt-20">
                <div className="flex flex-col sm:flex-row sm:items-end sm:space-x-4">
                  <Avatar className="w-32 h-32 sm:w-40 sm:h-40 border-4 border-background">
                    <AvatarImage
                      src={user.avatarUrl || "/placeholder.svg"}
                      alt={user.name}
                    />
                    <AvatarFallback className="text-2xl sm:text-3xl font-bold">
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>

                  <div className="mt-4 z-10 sm:mt-0 sm:pb-4 flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h1 className="text-2xl sm:text-3xl font-bold">
                        {user.name}
                      </h1>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant={getRoleBadgeVariant(user.role)}
                        className="flex items-center space-x-1"
                      >
                        {(() => {
                          const Icon = getRoleIcon(user.role);
                          return <Icon className="w-3 h-3" />;
                        })()}
                        <span>{user.role}</span>
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2 mt-4 sm:mt-0 sm:pb-4">
                  <Button
                    variant="destructive"
                    size="sm"
                    className="cursor-pointer"
                    onClick={handleDeleteUser}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete User
                  </Button>
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-6 space-y-6">
              {/* Contact Information */}
              <div>
                <h2 className="text-lg font-semibold mb-3">
                  Contact Information
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center space-x-3 text-sm">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span>{user.email}</span>
                  </div>
                  {user.phone && (
                    <div className="flex items-center space-x-3 text-sm">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span>{user.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-3 text-sm">
                    <CalendarDays className="w-4 h-4 text-muted-foreground" />
                    <span>
                      Joined {format(new Date(user.createdAt), "MMMM yyyy")}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <CalendarDays className="w-4 h-4 text-muted-foreground" />
                    <span>
                      Updated {format(new Date(user.updatedAt), "MMMM yyyy")}
                    </span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Account Status */}
              <div>
                <h2 className="text-lg font-semibold mb-3">Account Status</h2>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    {user.isVerified ? (
                      <ShieldCheck className="w-4 h-4 text-green-500" />
                    ) : (
                      <Shield className="w-4 h-4 text-yellow-500" />
                    )}
                    <span className="text-sm">
                      {user.isVerified
                        ? "Verified Account"
                        : "Unverified Account"}
                    </span>
                  </div>
                </div>
              </div>

              {/* CV Section */}
              {user.cvUrl && (
                <>
                  <Separator />
                  <div>
                    <h2 className="text-lg font-semibold mb-3">Documents</h2>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <FileText className="w-5 h-5 text-muted-foreground" />
                            <div>
                              <p className="font-medium">Curriculum Vitae</p>
                              <p className="text-sm text-muted-foreground">
                                CV document available
                              </p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm" asChild>
                            <a
                              href={user.cvUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </a>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </>
              )}

              {/* Recruiter Profile Section */}
              {user.role === "RECRUITER" && user.recruiterProfile && (
                <>
                  <Separator />
                  <div>
                    <h2 className="text-lg font-semibold mb-3">
                      Recruiter Profile
                    </h2>
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <Briefcase className="w-5 h-5" />
                          <span>About</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {user.recruiterProfile.about}
                        </p>
                        <div className="mt-4 pt-4 border-t">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-muted-foreground">
                            <div>
                              Profile created:{" "}
                              {format(
                                new Date(user.recruiterProfile.createdAt),
                                "MMM yyyy"
                              )}
                            </div>
                            <div>
                              Last updated:{" "}
                              {format(
                                new Date(user.recruiterProfile.updatedAt),
                                "MMM yyyy"
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
