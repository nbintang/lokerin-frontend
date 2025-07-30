"use client";
import ProfileSkeleton from "@/components/ProfileSkeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRecruiterProfile } from "@/shared-api/hooks/recruiter-profile/useRecruiterProfile";
import { CalendarDays, Globe, Mail, Pen, Phone } from "lucide-react";
import Link from "next/link";

export default function RecruiterAccount() {
  const { data: profile, isLoading, error } = useRecruiterProfile();
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

  const { user, company, position, about, createdAt } = profile;

  return (
    <>
      <div className="relative z-0">
        <div
          className="h-24 md:h-36   mx-0.5 overflow-hidden"
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
      <div className=" container mx-auto">
        <Card className="  bg-background rounded-none border-0 border-none shadow-none">
          <CardContent className="p-0">
            <div className="px-4 sm:px-6 pb-4">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between sm:space-x-4 -mt-16 sm:-mt-20">
                <div className="flex flex-col sm:flex-row sm:items-end sm:space-x-4">
                  <Avatar className="w-32 h-32 sm:w-40 sm:h-40 border-4 border-background ">
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

                  <div className="mt-4  z-10 sm:mt-0 sm:pb-4 flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h1 className="text-2xl sm:text-3xl font-bold">
                        {user.name}
                      </h1>
                    </div>
                    <p className="text-lg text-muted-foreground mb-2">
                      {position.name}
                    </p>
                    <Badge variant="secondary" className="mb-2">
                      {company.name}
                    </Badge>
                  </div>
                </div>

                <div className="flex space-x-2 mt-4 sm:mt-0 sm:pb-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="cursor-pointer"
                  >
                    <Pen className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-6 space-y-6">
              {about && (
                <div>
                  <h2 className="text-lg font-semibold mb-2">About</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {about}
                  </p>
                </div>
              )}
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
                      Joined{" "}
                      {new Date(createdAt).toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold mb-3">Company</h2>
                <Card className="bg-background  ">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-4">
                      {company.logoUrl && (
                        <Avatar className="w-12 h-12">
                          <AvatarImage
                            src={company.logoUrl || "/placeholder.svg"}
                            alt={company.name}
                          />
                          <AvatarFallback>
                            {company.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg mb-1">
                          {company.name}
                        </h3>
                        {company.description && (
                          <p className="text-muted-foreground text-sm mb-2 leading-relaxed">
                            {company.description}
                          </p>
                        )}
                        {company.website && (
                          <div className="flex items-center space-x-2 text-sm">
                            <Globe className="w-4 h-4 text-muted-foreground" />
                            <Link
                              href={company.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline"
                            >
                              {company.website.replace(/^https?:\/\//, "")}
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
