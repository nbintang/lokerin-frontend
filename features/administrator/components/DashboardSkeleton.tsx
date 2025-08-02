import { Skeleton } from "@/components/ui/skeleton";

export const DashboardSkeleton = () => {
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6"> 
      <div className="grid gap-4 px-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-4 lg:px-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex flex-col justify-between p-6 bg-card border rounded-lg h-[150px]">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-4 w-full" />
          </div>
        ))}
      </div>
      {/* Skeleton untuk User Growth Chart */}
      <div className="px-4 lg:px-6">
        <div className="p-6 border rounded-lg bg-card">
            <div className="flex justify-between items-center mb-4">
                 <Skeleton className="h-6 w-1/4" />
                 <div className="flex gap-2">
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-8 w-24" />
                 </div>
            </div>
            <Skeleton className="w-full h-96" />
        </div>
      </div>
    </div>
  );
};