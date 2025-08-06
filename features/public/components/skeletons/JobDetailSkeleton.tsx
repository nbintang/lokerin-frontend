"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export function JobDetailSkeleton() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Skeleton className="h-5 w-[120px]" />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Header */}
            <div className="p-6 border rounded-xl space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start md:items-center flex-wrap gap-4">
                  <Skeleton className="h-16 w-16 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
                <Skeleton className="h-6 w-20" />
              </div>

              <div className="space-y-4">
                <Skeleton className="h-4 w-64" />
                <div className="flex gap-4 flex-wrap">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            </div>

            {/* Job Description */}
            <div className="p-6 border rounded-xl space-y-4">
              <Skeleton className="h-6 w-40" />
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-4 w-full" />
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="gap-y-6 flex flex-col-reverse md:flex-col">
            {/* Apply Card */}
            <div className="p-6 border rounded-xl space-y-4">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-10 w-full mt-4 rounded-md" />
            </div>

            {/* Company Info */}
            <div className="p-6 border rounded-xl space-y-4">
              <Skeleton className="h-6 w-40" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>

            {/* Job Details */}
            <div className="p-6 border rounded-xl space-y-4">
              <Skeleton className="h-6 w-32" />
              <div className="grid gap-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="grid grid-cols-2 gap-2 items-center">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-28 ml-auto" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
