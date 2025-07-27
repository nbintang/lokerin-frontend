import { Skeleton } from "@/components/ui/skeleton";

export default function RecruiterAccountSkeleton() {
  return (
    <div>
      {/* Banner Placeholder */}
      <Skeleton className="h-24 md:h-36 rounded-t-lg" />

      <div className="container mx-auto">
        <div className="bg-background rounded-none border-0">
          <div className="p-0">
            <div className="px-4 sm:px-6 pb-4">
              {/* Profile Header section (Avatar, Name, Button) */}
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between sm:space-x-4 -mt-16 sm:-mt-20">
                <div className="flex flex-col sm:flex-row sm:items-end sm:space-x-4">
                  {/* Avatar Placeholder */}
                  <div className="h-32 bg-border   w-32 sm:h-40 sm:w-40 rounded-full border-4 border-background" />

                  <div className="mt-4 sm:mt-0 sm:pb-4 flex-1 space-y-2">
                    {/* Name Placeholder */}
                    <Skeleton className="h-8 w-48" />
                    {/* Position Placeholder */}
                    <Skeleton className="h-6 w-32" />
                    {/* Badge Placeholder */}
                    <Skeleton className="h-6 w-24 rounded-md" />
                  </div>
                </div>
                {/* Button Placeholder */}
                <div className="flex mt-4 sm:mt-0 sm:pb-4">
                  <Skeleton className="h-9 w-24 rounded-md" />
                </div>
              </div>
            </div>

            {/* Content Body Placeholder */}
            <div className="p-4 sm:p-6 space-y-8">
              {/* About Section Placeholder */}
              <div className="space-y-3">
                <Skeleton className="h-6 w-24" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                </div>
              </div>

              {/* Contact Info Placeholder */}
              <div className="space-y-3">
                <Skeleton className="h-6 w-48" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Skeleton className="h-5 w-5/6" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-4/6" />
                </div>
              </div>

              {/* Company Section Placeholder */}
              <div className="space-y-3">
                <Skeleton className="h-6 w-32" />
                <div className="p-4 border border-border rounded-lg">
                  <div className="flex items-start space-x-4">
                    {/* Company Logo Placeholder */}
                    <Skeleton className="h-12 w-12 rounded-md" />
                    <div className="flex-1 space-y-2">
                      {/* Company Name Placeholder */}
                      <Skeleton className="h-6 w-1/2" />
                      {/* Company Description Placeholder */}
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-5/6" />
                      {/* Company Website Placeholder */}
                      <Skeleton className="h-4 w-1/3" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}