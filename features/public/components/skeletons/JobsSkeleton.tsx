"use client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function JobCardSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
          <Skeleton className="h-6 w-[100px]" />
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="space-y-2 mb-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-[90%]" />
        </div>
        <div className="flex flex-col gap-4 text-sm">
          <Skeleton className="h-5 w-[120px]" />
          <div className="flex gap-2">
            <Skeleton className="h-5 w-[120px]" />
            <Skeleton className="h-5 w-[120px]" />
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-4 border-t flex items-center justify-between">
        <Skeleton className="h-5 w-[100px]" />
        <Skeleton className="h-10 w-[110px]" />
      </CardFooter>
    </Card>
  );
}
