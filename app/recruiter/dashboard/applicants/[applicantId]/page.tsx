"use client";
import {
  ApplicantResponse,
  useApplicant,
} from "@/shared-api/hooks/job-applicants/useApplicant";
import { use } from "react";
import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Globe,
  User,
  Pen,
  CalendarDays,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import RecruiterAccountSkeleton from "@/components/ProfileSkeleton";
import useHandleSelectStatusDialog from "@/hooks/useHandleSelectStatusDialog";
export default function Applicant({
  params,
}: {
  params: Promise<{ applicantId: string }>;
}) {
  const { applicantId } = use(params);
  const { data: applicant, isLoading, error } = useApplicant(applicantId);
  const setOpenDialog = useHandleSelectStatusDialog((state) => state.setOpen);
  const getStatusVariant = (status: ApplicantResponse["status"]) => {
    switch (status) {
      case "REJECTED":
        return "destructive";
      case "ACCEPTED":
        return "default"; // Or a custom success variant
      case "APPLIED":
        return "secondary";
      case "REVIEWED":
        return "outline";
      default:
        return "secondary";
    }
  };

  if (isLoading) {
    return <RecruiterAccountSkeleton />;
  }

  if (error || !applicant) {
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

  const { user, job, status } = applicant;
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
                      {job.role.name}
                    </p>
                    <Badge variant={getStatusVariant(status)} className="mb-2">
                      {status.charAt(0) + status.slice(1).toLowerCase()}
                    </Badge>
                  </div>
                </div>

                <div className="flex space-x-2 mt-4 sm:mt-0 sm:pb-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setOpenDialog({
                        isOpen: true,
                        applicant :{
                          jobId: job.id,
                          status,
                          id: applicant.id
                        }
                      })
                    }
                    className="cursor-pointer"
                  >
                    <Pen className="w-4 h-4 mr-2" />
                    Change Status
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
                      {new Date(user.createdAt).toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold mb-3">Company Applied</h2>
                <Card className="bg-background  ">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-4">
                      {job.company.logoUrl && (
                        <Avatar className="w-12 h-12">
                          <AvatarImage
                            src={job.company.logoUrl || "/placeholder.svg"}
                            alt={job.company.name}
                          />
                          <AvatarFallback>
                            {job.company.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg mb-1">
                          {job.company.name}
                        </h3>
                        {job.company.description && (
                          <p className="text-muted-foreground text-sm mb-2 leading-relaxed">
                            {job.company.description}
                          </p>
                        )}
                        <div className="flex items-center gap-x-2">
                          {job.location && (
                            <div className="flex items-center space-x-2 text-sm">
                              <MapPin className="w-4 h-4 text-muted-foreground" />
                              <span>{job.location}</span>
                            </div>
                          )}
                          {job.company.website && (
                            <div className="flex items-center space-x-2 text-sm">
                              <Globe className="w-4 h-4 text-muted-foreground" />
                              <Link
                                href={job.company.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline"
                              >
                                {job.company.website.replace(
                                  /^https?:\/\//,
                                  ""
                                )}
                              </Link>
                            </div>
                          )}
                        </div>
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
