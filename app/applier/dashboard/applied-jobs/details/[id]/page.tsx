"use client";
import ProfileSkeleton from "@/components/skeletons/ProfileSkeleton";
import { Card, CardContent } from "@/components/ui/card";

import { use } from "react";
import CompanyImageExample from "@/public/placeholder/company-example.jpeg";
import { isValidImageUrl } from "@/helpers/validate-image-url";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  CalendarDays,
  Globe,
  MapPin,
  Briefcase,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAppliedJob } from "@/shared-api/hooks/applied-job/useAppliedJob";

export default function AppliedDetailPages({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: appliedJob, isLoading, error } = useAppliedJob({ id });

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (error || !appliedJob) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">
            Failed to load job application information.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Extract job data from applied job response
  const { job, status, createdAt: appliedAt, updatedAt } = appliedJob;
  const { company, role, description, location } = job;

  // Determine company image
  const companyImage = isValidImageUrl(company.logoUrl)
    ? company.logoUrl
    : CompanyImageExample.src;

  // Get status configuration
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "ACCEPTED":
        return {
          color:
            "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
          icon: CheckCircle,
          label: "Accepted",
        };
      case "REJECTED":
        return {
          color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
          icon: XCircle,
          label: "Rejected",
        };
      case "REVIEWED":
        return {
          color:
            "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
          icon: FileText,
          label: "Under Review",
        };
      case "APPLIED":
        return {
          color:
            "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
          icon: Clock,
          label: "Applied",
        };
      default:
        return {
          color:
            "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
          icon: Clock,
          label: "Unknown",
        };
    }
  };

  const statusConfig = getStatusConfig(status);
  const StatusIcon = statusConfig.icon;

  return (
    <>
      <div className="relative">
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
                        {company.name
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("") || "C"}
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

                        {/* Application Status Badge */}
                        <Badge
                          className={cn(
                            "flex items-center space-x-1",
                            statusConfig.color
                          )}
                        >
                          <StatusIcon className="w-4 h-4 flex-shrink-0" />
                          <span>{statusConfig.label}</span>
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-6 space-y-6">
                {/* Application Status Information */}
                <div>
                  <h2 className="text-lg font-semibold mb-3">
                    Application Status
                  </h2>
                  <div className="grid grid-cols-1   gap-4">
                    <div className="flex items-center space-x-3 text-sm">
                      <CalendarDays className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <span className="font-medium">Applied:</span>
                        <span className="ml-1">
                          {format(new Date(appliedAt), "dd MMMM yyyy")}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 text-sm">
                      <StatusIcon className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <span className="font-medium">Status:</span>
                        <span className="ml-1">{statusConfig.label}</span>
                      </div>
                    </div>
                    {updatedAt !== appliedAt && (
                      <div className="flex items-center space-x-3 text-sm sm:col-span-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <span className="font-medium">Last Updated:</span>
                          <span className="ml-1">
                            {format(new Date(updatedAt), "dd MMMM yyyy")}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

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
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>{location}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm">
                      <Briefcase className="w-4 h-4 text-muted-foreground" />
                      <span>{role.name}</span>
                    </div>
                  </div>
                </div>

                {/* Company Information */}
                <div>
                  <h2 className="text-lg font-semibold mb-3">Company</h2>
                  <Card className="bg-background">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-4">
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
