"use client";
import {
  TableFilters,
  TableMain,
  TablePagination,
  TableSkeleton,
  useTable,
} from "@/components/dashboard/data-table";
import { Button } from "@/components/ui/button";
import { type Jobs, useJobs } from "@/shared-api/hooks/jobs/useJobs";
import { useSearchParams } from "next/navigation";
import { applierJobColumns } from "@/features/applier/job/columns";
import { IconSparkles, IconTrendingUp } from "@tabler/icons-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEffect, useState } from "react";
import { useHandleAiFeaturesDialog } from "@/hooks/useHandleCvUploadDialog";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useDebounce } from "use-debounce";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

const tips = [
  "Try AI Features!",
  "You should try this feature!",
  "Get job suggestions instantly!",
  "Have you tried this feature yet?",
  "Smart recommendations just for you!",
  "Boost your career with AI!",
];

export default function Jobs() {
  const searchParams = useSearchParams();
  const isMobile = useIsMobile();
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [searchJob] = useDebounce(searchKeyword, 500);
const [currentTip, setCurrentTip] = useState<string>("");
   const [lastFetchKeyword, setLastFetchKeyword] = useState<string | null>(null);
  const setOpenAiFeatures = useHandleAiFeaturesDialog((state) => state.setOpen);
  const [aiTipOpen, setAiTipOpen] = useState<boolean>(false);
  const page = Number(searchParams.get("page") ?? 1);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const limit = Number(searchParams.get("limit") ?? 10);
  
  const jobs = useJobs({ page, limit, isPublic: false, name: searchJob });
  
  const { table } = useTable<Jobs>({
    columns: applierJobColumns,
    data: jobs.data?.jobs ?? [], 
  });

  useEffect(() => {
    if (lastFetchKeyword !== searchJob) {
      const randomTip = tips[Math.floor(Math.random() * tips.length)];
      setCurrentTip(randomTip);
      setLastFetchKeyword(searchJob);
    }
  }, [ searchJob, lastFetchKeyword]);

  useEffect(() => {
    const t1 = setTimeout(() => setAiTipOpen(true), 500);
    const t2 = setTimeout(() => setAiTipOpen(false), 3500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [jobs.isLoading, jobs.error]);
 
  useEffect(() => {
    if (jobs.isSuccess && isInitialLoad) {
      setIsInitialLoad(false);
    }
  }, [jobs.isSuccess, isInitialLoad]);

  const shouldShowSkeleton = jobs.isLoading && isInitialLoad;
  const isSearchLoading = jobs.isFetching && !isInitialLoad;

  if (shouldShowSkeleton) {
    return (
      <div className="flex flex-1 flex-col md:gap-4 gap-2 py-4 mx-3 md:mx-5 md:py-6">
        <TableSkeleton />
      </div>
    );
  }

  if (jobs.isError || jobs.error) {
    return (
      <div className="flex flex-1 flex-col md:gap-4 gap-2 py-4 mx-3 md:mx-5 md:py-6">
        <div className="flex items-center justify-center gap-2">
          <span className="text-sm text-muted-foreground">
            {jobs.error?.message}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col md:gap-4 gap-2 py-4 mx-3 md:mx-5 md:py-6">
      {(jobs.isSuccess || (jobs.isLoading && !isInitialLoad)) && (
        <>
          <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
            <Card className="@container/card">
              <CardHeader>
                <CardDescription>Total Jobs Available</CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-5xl">
                  { jobs.isLoading ? "..." : jobs.data?.total || 0}
                </CardTitle>
                <CardAction>
                  <Badge variant="outline">
                    <IconTrendingUp />
                    { jobs.isLoading ? "..." : jobs.data?.total || 0}
                  </Badge>
                </CardAction>
              </CardHeader>
            </Card>
          </div>

          <TooltipProvider delayDuration={0}>
            <div className="flex items-start flex-wrap gap-3 justify-between mb-2 sm:mb-0 rounded-b-md">
              <div className="flex items-center gap-x-3">
                <TableFilters<Jobs> table={table} />
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Search jobs..."
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    className="max-w-sm"
                  />
                  {/* Show loading indicator for search */}
                  {isSearchLoading && (
                    <Loader2 className="animate-spin size-4" />
                  )}
                </div>
              </div>
              <Tooltip open={aiTipOpen} onOpenChange={setAiTipOpen}>
                <TooltipTrigger className="fixed bottom-3 right-3 z-50 md:inline-flex md:static" asChild>
                  <Button
                    onClick={() => setOpenAiFeatures(true)}
                    variant="special"
                  >
                    <IconSparkles />
                    AI Recommendation
                  </Button>
                </TooltipTrigger>
                <TooltipContent
                  side={isMobile ? "top" : "left"}
                  sideOffset={8}
                >
                 {currentTip}
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>

          {/* Pass isLoading to TableMain */}
          <TableMain<Jobs> 
            table={table} 
            isLoading={isSearchLoading}
          />
          
          <TablePagination<Jobs>
            limit={limit}
            page={page}
            table={table}
            total={jobs.data?.total || 0}
          />
        </>
      )}
    </div>
  );
}