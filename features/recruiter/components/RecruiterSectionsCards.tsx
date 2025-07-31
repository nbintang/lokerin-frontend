import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  JobApplicantResponse,
  useJobApplicants,
} from "@/shared-api/hooks/job-applicants/useJobApplicants";
import { LoaderCircleIcon } from "lucide-react";
import { UseQueryResult } from "@tanstack/react-query";
import { Skeleton } from "../../../components/ui/skeleton";

export function RecruiterSectionsCards({
  query,
}: {
  query: UseQueryResult<JobApplicantResponse, Error>;
}) {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid-cols-1 gap-4  *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card w-full">
        <CardHeader>
          {query.isLoading ? (
            <Skeleton className="h-7 w-1/3 md:w-1/12" />
          ) : (
            <CardDescription>Total Applicants</CardDescription>
          )}
          <CardTitle className="text-2xl font-semibold tabular-nums flex items-center @[250px]/card:text-3xl">
            {query.isLoading ? (
            <Skeleton className="size-12 rounded-full" />
            ) : (
              query.data?.total
            )}
          </CardTitle>
          <CardAction>
            {query.isLoading ? (
              <Badge variant="outline" className="rounno p-0">
                <Skeleton className="h-4 w-4 rounded-none" />
              </Badge>
            ) : (
              <Badge variant="outline">
                <IconTrendingUp />
                {query.data?.total}%
              </Badge>
            )}
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          {query.isLoading ? (
            <Skeleton className="h-4 w-1/3 md:w-1/12" />
          ) : (
            <div className="line-clamp-1 flex gap-2 font-medium">
              Applicants for the last 6 months{" "}
              <IconTrendingUp className="size-4" />
            </div>
          )}
          {query.isSuccess && (
            <div className="text-muted-foreground">
              Your applicants for the last 6 months
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
