"use client";
import ProfileSkeleton from "@/components/skeletons/ProfileSkeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useProfile } from "@/shared-api/hooks/profile/useProfile";
import { format } from "date-fns";
import { CalendarDays, Mail, Pen, Phone } from "lucide-react";
import Link from "next/link";

export default function RecruiterAccount() {
  const { data: profile, isLoading, error } = useProfile();
  if (isLoading) {
    return <ProfileSkeleton />;
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
    <>
      <div className="relative z-0">
        <div
          className="h-24 md:h-36   mx-0.5 overflow-hidden"
          style={{
            backgroundImage: profile.avatarUrl
              ? `url(${profile.avatarUrl})`
              : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-white/40 dark:bg-black/80" />
      </div>
      <div className=" container mx-auto">
        <Card className="  bg-background rounded-none border-0 border-none shadow-none">
          <CardContent className="p-0">
            <div className="px-4 sm:px-6 pb-4">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between sm:space-x-4 -mt-16 sm:-mt-20">
                <div className="flex flex-col sm:flex-row sm:items-end sm:space-x-4">
                  <Avatar className="w-32 h-32 sm:w-40 sm:h-40 border-4 border-background ">
                    <AvatarImage
                      src={profile.avatarUrl || "/placeholder.svg"}
                      alt={profile.name}
                    />
                    <AvatarFallback className="text-2xl sm:text-3xl font-bold">
                      {profile.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>

                  <div className="mt-4  z-10 sm:mt-0 sm:pb-4 flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h1 className="text-2xl sm:text-3xl font-bold">
                        {profile.name}
                      </h1>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2 mt-4 sm:mt-0 sm:pb-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="cursor-pointer"
                    asChild
                  >
                    <Link href={"/administrator/account/settings"}>
                      <Pen className="w-4 h-4 mr-2" />
                      Edit
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-6 space-y-6">
              <div>
                <h2 className="text-lg font-semibold mb-3">
                  Contact Information
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center space-x-3 text-sm">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span>{profile.email}</span>
                  </div>
                  {profile.phone && (
                    <div className="flex items-center space-x-3 text-sm">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span>{profile.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-3 text-sm">
                    <CalendarDays className="w-4 h-4 text-muted-foreground" />
                    <span>
                      Joined {format(new Date(profile.createdAt), "MMMM yyyy")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
