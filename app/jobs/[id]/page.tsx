"use client";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  Building2,
  Clock,
  Globe,
  Calendar,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useJob } from "@/shared-api/hooks/jobs/useJob";
import { formatDistanceToNow } from "date-fns";
import { use } from "react";
import { IconCash } from "@tabler/icons-react";
import { formatSalaryRangePublic } from "@/helpers/concurrency-converter";
import { JobDetailSkeleton } from "@/features/public/components/skeletons/JobDetailSkeleton";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: job, isLoading, isError, error } = useJob(id);
  if (isLoading) return <JobDetailSkeleton />;
  if (isError || error || !job)
    return (
      <div className="min-h-screen ">
        <div className="container mx-auto px-4 py-8">
          <p className="text-2xl font-bold text-destructive">
            {error?.message}
          </p>
        </div>
      </div>
    );
  return (
    <div className="min-h-screen ">
      <div className="container mx-auto  py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Jobs
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Header */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start md:items-center flex-wrap gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage
                        src={job.company.logoUrl || "/placeholder.svg"}
                        alt={job.company.name}
                      />
                      <AvatarFallback className="text-lg">
                        {job.company.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h1 className="text-2xl font-bold text-primary mb-1">
                        {job.role.name}
                      </h1>
                      <p className="text-lg text-muted-foreground font-medium">
                        {job.company.name}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    <Clock className="h-3 w-3" />
                    {formatDistanceToNow(job.createdAt)}
                  </Badge>
                </div>

                <div className="flex flex-col items-start justify-center gap-6 text-muted-foreground">
                  <div className="flex items-center max-w-[200px] md:max-w-md gap-1">
                    <MapPin className="size-4 flex-shrink-0" />
                    <span className="truncate">{job.location}</span>
                  </div>
                  <div className="flex items-center flex-wrap gap-4">
                    <div className="flex items-center gap-1">
                      <Building2 className="size-4" />
                      <span>Full-time</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <IconCash className="size-4 " />
                      <span>{formatSalaryRangePublic(job.salaryRange)}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Job Description */}
            <Card>
              <CardHeader>
                <CardTitle>Job Description</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-gray max-w-none">
                  {job.description.split("\n").map((paragraph, index) => (
                    <p
                      key={index}
                      className="mb-4  text-muted-foreground leading-relaxed"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="gap-y-6 flex flex-col-reverse md:flex-col">
            {/* Apply Card */}
            <Card className="">
              <CardContent>
                <div className="mb-4">
                  <h2 className=" text-lg font-semibold">Action</h2>
                  <p className="text-muted-foreground">
                    Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                    Similique culpa dolores placeat?
                  </p>
                </div>
                <Button
                  size="lg"
                  className="w-full mb-4"
                  variant={"default"}
                  asChild
                >
                  <Link href={"/auth/signin"}>Apply Now</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Company Info */}
            <Card>
              <CardHeader>
                <CardTitle>About {job.company.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="  text-sm leading-relaxed">
                  {job.company.description}
                </p>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Globe className="h-4 w-4  text-muted-foreground" />
                    <Link
                      href={job.company.website}
                      className="text-blue-600 hover:text-blue-700"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {job.company.website}
                    </Link>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 " />
                    <span>
                      Created at {new Date(job.company.createdAt).getFullYear()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Job Details */}
            <Card>
              <CardHeader>
                <CardTitle>Job Details</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3 text-sm">
                <div className="grid grid-cols-2">
                  <span className="text-muted-foreground">Posted:</span>
                  <span className="font-medium text-right">
                    {formatDistanceToNow(job.createdAt)}
                  </span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="text-muted-foreground">Updated:</span>
                  <span className="font-medium text-right">
                    {formatDistanceToNow(job.updatedAt)}
                  </span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="text-muted-foreground">Location:</span>
                  <span className="font-medium text-right truncate max-w-[200px]">
                    {job.location}
                  </span>
                </div>

                <div className="grid grid-cols-2">
                  <span className="text-muted-foreground">Salary:</span>
                  <span className="font-medium text-right">
                    {formatSalaryRangePublic(job.salaryRange)}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
