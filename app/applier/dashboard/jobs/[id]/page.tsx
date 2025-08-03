"use client";
import ProfileSkeleton from "@/components/ProfileSkeleton";
import { Card, CardContent } from "@/components/ui/card";
import { useJob } from "@/shared-api/hooks/jobs/useJob";
import { use } from "react";
import CompanyImageExample from "@/public/placeholder/company-example.jpeg";
import { isValidImageUrl } from "@/helpers/validate-image-url";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CalendarDays,
  Globe, MapPin, Briefcase
} from "lucide-react";
import Link from "next/link";
import {
  formatSalaryRangePublic
} from "@/helpers/concurrency-converter";
import { IconCash } from "@tabler/icons-react";
import { format } from "date-fns";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useHandleWarningDialog from "@/hooks/useHandleWarningDialog";
import { useApplyJob } from "@/shared-api/hooks/applied-job/useApplyJob";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: job, isLoading, error } = useJob(id);
  const setOpenDialog = useHandleWarningDialog((s) => s.setOpenDialog);
  const { mutate } = useApplyJob(id);
  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (error || !job) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">
            Failed to load job information.
          </p>
        </CardContent>
      </Card>
    );
  }

  const handleApplyJob = async () =>
    setOpenDialog({
      title: "Apply Job",
      description: "Are you sure you want to apply for this job?",
      onConfirm: () => mutate(),
      isOpen: true,
      buttonVariants: "default",
    });
  // Tentukan gambar yang akan digunakan
  const companyImage = isValidImageUrl(job.company.logoUrl)
    ? job.company.logoUrl
    : CompanyImageExample.src;

  // Destructure data from job response
  const { company, role, user, description, location, salaryRange, createdAt } =
    job;
  const recruiterPosition = user?.recruiterProfile?.position;

  return (
    <>
      <div className="relative ">
        <div
          className="h-24 md:h-36 overflow-hidden"
          style={{
            backgroundImage: `url(${companyImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-white/40 dark:bg-black/80" />
      </div>
      <TooltipProvider>
        <div className="container mx-auto">
          <Card className="bg-background rounded-none border-0 border-none shadow-none">
            <CardContent className="p-0">
              <div className="px-4 sm:px-6 pb-4">
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between sm:space-x-4 -mt-16 sm:-mt-20">
                  <div className="flex flex-col sm:flex-row sm:items-end sm:space-x-4">
                    <Avatar className="w-32 h-32 sm:w-40 sm:h-40 border-4 border-background">
                      <AvatarImage src={companyImage} alt={company.name} />
                      <AvatarFallback className="text-2xl sm:text-3xl font-bold">
                        {user?.name
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("") || "R"}
                      </AvatarFallback>
                    </Avatar>

                    <div className="mt-4 z-10 sm:mt-0 sm:pb-4 flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h1 className="text-2xl sm:text-3xl font-bold">
                          {role.name}
                        </h1>
                      </div>
                      <p className="text-lg text-muted-foreground mb-2">
                        {company.name}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-2">
                        <Tooltip>
                          <TooltipTrigger>
                            <Badge
                              variant="secondary"
                              className="max-w-[200px] flex items-center space-x-1"
                            >
                              <MapPin className="w-4 h-4 flex-shrink-0" />
                              <p className="truncate">{location}</p>
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent side="right">
                            <p className="w-[150px]">{location}</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2 mt-4 sm:mt-0 sm:pb-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="cursor-pointer"
                      onClick={handleApplyJob}
                    >
                      <Briefcase className="w-4 h-4 mr-2" />
                      Apply
                    </Button>
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-6 space-y-6">
                {/* Job Description */}
                <div>
                  <h2 className="text-lg font-semibold mb-2">
                    Job Description
                  </h2>
                  <p className="text-muted-foreground sm:max-w-2/3 max-w-none leading-relaxed">
                    {description}
                  </p>
                </div>
                {/* Job Details */}
                <div>
                  <h2 className="text-lg font-semibold mb-3">Job Details</h2>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-center space-x-3 text-sm">
                      <CalendarDays className="w-4 h-4 text-muted-foreground" />
                      <span>Posted {format(createdAt, "dd MMMM yyyy")}</span>
                    </div>

                    <div className="flex items-center space-x-3 text-sm">
                      <IconCash className="w-4 h-4 text-muted-foreground" />
                      <span>{formatSalaryRangePublic(salaryRange)}</span>
                    </div>
                  </div>
                </div>

                {/* Company Information */}
                <div>
                  <h2 className="text-lg font-semibold mb-3">Company</h2>
                  <Card className="bg-background">
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
      </TooltipProvider>
    </>
  );
}
