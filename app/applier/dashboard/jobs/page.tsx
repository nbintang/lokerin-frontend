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
import { IconSparkles } from "@tabler/icons-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEffect, useState } from "react";
import { useHandleAiFeaturesDialog } from "@/hooks/useHandleCvUploadDialog";
import { useIsMobile } from "@/hooks/use-mobile";
import { useDebounce } from "use-debounce";
import { Input } from "@/components/ui/input";
import { SectionCardSkeleton } from "@/components/skeletons/SectionCardSkeleton";
import { SectionCard } from "@/components/dashboard/section-card";
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
  const page = Number(searchParams.get("page") ?? 1);
  const limit = Number(searchParams.get("limit") ?? 10);
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [currentTip, setCurrentTip] = useState<string>("");
  const [aiTipOpen, setAiTipOpen] = useState<boolean>(false);
  const setOpenAiFeatures = useHandleAiFeaturesDialog((state) => state.setOpen);
  const [debounceSearch, debounceSearchState] = useDebounce(searchKeyword, 500);
  const isMobile = useIsMobile();
  const [isSearching, setIsSearching] = useState(false);
  const {
    data: jobs,
    isLoading,
    isFetching,
    error,
    isError,
    isSuccess,
  } = useJobs({ page, limit, isPublic: false, name: debounceSearch });

  const { table } = useTable<Jobs>({
    columns: applierJobColumns,
    data: jobs?.jobs ?? [],
  });

  useEffect(() => {
    if (debounceSearchState.isPending()) {
      setIsSearching(true);
    }
  }, [debounceSearchState]);

  useEffect(() => {
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    setCurrentTip(randomTip);
  }, [isLoading, error]);

  useEffect(() => {
    const t1 = setTimeout(() => setAiTipOpen(true), 500);
    const t2 = setTimeout(() => setAiTipOpen(false), 3500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [isLoading, error]);

  if (isLoading || isSearching || isFetching) {
    return (
      <div className="flex flex-1 flex-col md:gap-4 gap-2 py-4 mx-3 md:mx-5 md:py-6">
        <SectionCard userTitle="Jobs" total={jobs?.total ?? 0} />
        <TooltipProvider delayDuration={0}>
          <div className="flex items-start flex-wrap gap-3 justify-between mb-2 sm:mb-0 rounded-b-md">
            <div className="flex items-center gap-x-3">
              <TableFilters<Jobs> table={table} />
              <div className="relative w-full max-w-md">
                <Input
                  placeholder="Search jobs..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="w-full"
                />
                {isFetching && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  </div>
                )}
              </div>
            </div>
            <Tooltip open={aiTipOpen} onOpenChange={setAiTipOpen}>
              <TooltipTrigger
                className="fixed bottom-3 right-3 z-50 md:inline-flex md:static"
                asChild
              >
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
                className=" bg-white text-black shadow-md"
                arrowClassName="fill-white bg-white"
              >
                {currentTip}
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
        <TableSkeleton />
      </div>
    );
  }

  if (isError || error) {
    return (
      <div className="flex flex-1 flex-col md:gap-4 gap-2 py-4 mx-3 md:mx-5 md:py-6">
        <div className="flex items-center justify-center gap-2">
          <span className="text-sm text-muted-foreground">
            {error?.message}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col md:gap-4 gap-2 py-4 mx-3 md:mx-5 md:py-6">
      {isSuccess && (
        <>
          <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
            <SectionCard userTitle="Jobs" total={jobs?.total ?? 0} />
          </div>

          <TooltipProvider delayDuration={0}>
            <div className="flex items-start flex-wrap gap-3 justify-between mb-2 sm:mb-0 rounded-b-md">
              <div className="flex items-center gap-x-3">
                <TableFilters<Jobs> table={table} />
                <div className="relative flex-1">
                  <Input
                    placeholder="Search jobs..."
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    className="w-full max-w-md"
                  />
                </div>
              </div>
              <Tooltip open={aiTipOpen} onOpenChange={setAiTipOpen}>
                <TooltipTrigger
                  className="fixed bottom-3 right-3 z-50 md:inline-flex md:static"
                  asChild
                >
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
                  className=" bg-white text-black shadow-md"
                  arrowClassName="fill-white bg-white"
                >
                  {currentTip}
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>

          {/* Pass isLoading to TableMain */}
          <TableMain<Jobs> table={table} />

          <TablePagination<Jobs>
            limit={limit}
            page={page}
            table={table}
            total={jobs?.total || 0}
          />
        </>
      )}
    </div>
  );
}
