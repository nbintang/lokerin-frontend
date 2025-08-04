"use client";
import Link from "next/link";
import {
  MapPin,
  Building2,
  Clock,
  ChevronRight,
  Loader2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useJobsInfinite } from "@/shared-api/hooks/jobs/useJobs";
import { formatDistanceToNow } from "date-fns";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import { formatSalaryRangePublic } from "@/helpers/concurrency-converter";
import { IconCash } from "@tabler/icons-react";
import { JobCardSkeleton } from "@/features/public/components/skeletons/JobsSkeleton";
 

export default function JobsPage() {
  const { ref, inView } = useInView({
    threshold: 0.1,
    rootMargin: "100px",
  });

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useJobsInfinite({
    limit: 10,
  });

  // Fetch next page when ref is in view
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      console.log("Fetching next page...");
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const jobs = data?.pages.flatMap((page) => page.jobs) ?? [];

  if (isLoading) {
    return (
      <div className="grid gap-6 container mx-auto px-4 py-8">
        {Array.from({ length: 10 }, (_, index) => (
          <JobCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-500">
          Error loading jobs. Please try again.
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mt-4 mb-8 flex items-center gap-4 text-sm">
        <span>{data?.pages?.[0]?.total ?? 0} jobs found</span>
        <Separator orientation="vertical" className="h-4 w-px data-[orientation=vertical]:h-4" />
        <span>
          Page {data?.pages.length ?? 1} of{" "}
          {Math.ceil(
            (data?.pages?.[0]?.total ?? 1) / (data?.pages?.[0]?.limit ?? 10)
          )}
        </span>
      </div>

      {/* Job Cards */}
      <div className="grid gap-6">
        {jobs.map((job, index) => (
          <Card
            key={`${job.id}-${index}`} // Better key to avoid duplicates
            className="transition-shadow duration-200"
          >
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src={job.company.logoUrl || "/placeholder.svg"}
                      alt={job.company.name}
                    />
                    <AvatarFallback>
                      {job.company.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-semibold transition-colors">
                      <Link href={`/jobs/${job.id}`}>{job.role.name}</Link>
                    </h3>
                    <p className="text-muted-foreground font-medium">
                      {job.company.name}
                    </p>
                  </div>
                </div>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatDistanceToNow(new Date(job.createdAt))}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="pb-4">
              <p className="text-accent-foreground mb-4 line-clamp-2">
                {job.description}
              </p>

              <div className="flex flex-col items- gap-4 text-sm text-muted-foreground">
                <div className="flex items-center max-w-[200px] md:max-w-md gap-1">
                  <MapPin className="size-4 flex-shrink-0" />
                  <span className="truncate">{job.location}</span>
                </div>
                <div className="flex items-center gap-4">
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
            </CardContent>

            <CardFooter className="pt-4 border-t flex items-center justify-between">
              <Link
                href={`/jobs/${job.id}`}
                className="flex items-center gap-1 font-medium"
              >
                View Details
                <ChevronRight className="h-4 w-4" />
              </Link>
              <Button   variant={"default"}
                  asChild
                >
                  <Link href={"/auth/signin"}>Apply Now</Link></Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Loading more indicator and trigger element */}
      {hasNextPage && (
        <div className="mt-8 text-center">
          {isFetchingNextPage ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-x-3">
                <Loader2 className="animate-spin text-primary size-5" />
                <p className="text-muted-foreground">Loading more jobs...</p>
              </div>
            </div>
          ) : (
            <div
              ref={ref}
              className="py-4 text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
              onClick={() => fetchNextPage()}
            >
              Load more jobs...
            </div>
          )}
        </div>
      )}

      {/* End of results message */}
      {!hasNextPage && jobs.length > 0 && (
        <div className="mt-8 text-center py-8 text-muted-foreground">
          You&apos;ve reached the end of the job listings
        </div>
      )}
    </>
  );
}
