"use client";
import {
  TableFilters,
  TableMain,
  TablePagination,
  TableSkeleton,
  useTable,
} from "@/components/dashboard/data-table";
import { recruiterJobColumns } from "@/features/recruiter/job/columns";
import { Button } from "@/components/ui/button";
import { type Jobs, useJobs } from "@/shared-api/hooks/jobs/useJobs";
import { FilePlus2 } from "lucide-react";
import Link from "next/link";
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
  const [currentTip, setCurrentTip] = useState(tips[0]);
  const setOpenAiFeatures = useHandleAiFeaturesDialog((state) => state.setOpen);
  const [aiTipOpen, setAiTipOpen] = useState<boolean>(false);
  const page = Number(searchParams.get("page") ?? 1);
  const limit = Number(searchParams.get("limit") ?? 10);
  const jobs = useJobs({ page, limit, isPublic: false });
  const { table } = useTable<Jobs>({
    columns: applierJobColumns,
    data: jobs.data?.jobs ?? [],
  });
  useEffect(() => {
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    setCurrentTip(randomTip);
  }, []);
  useEffect(() => {
    const t1 = setTimeout(() => setAiTipOpen(true), 500);
    const t2 = setTimeout(() => setAiTipOpen(false), 3500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [jobs.isLoading, jobs.error]);

  if (jobs.isLoading) {
    return (
      <div className="flex flex-1 flex-col  md:gap-4 gap-2 py-4 mx-3 md:mx-5  md:py-6">
        <TableSkeleton />
      </div>
    );
  }
  return (
    <div className="flex flex-1 flex-col  md:gap-4 gap-2 py-4 mx-3 md:mx-5  md:py-6">
      {jobs.isError && (
        <div className="flex items-center justify-center gap-2">
          <span className="text-destructive">Error</span>
        </div>
      )}
      {jobs.isSuccess && jobs.data && (
        <>
          <TooltipProvider delayDuration={0}>
            <div className="flex items-start gap-x-3 justify-between sm:justify-start mb-2 sm:mb-0  rounded-b-md">
              <TableFilters<Jobs> table={table} />
              <Tooltip open={aiTipOpen} onOpenChange={setAiTipOpen}>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => setOpenAiFeatures(true)}
                    variant="special"
                  >
                    <IconSparkles />
                    AI Recommendation
                  </Button>
                </TooltipTrigger>
                <TooltipContent
                  side={isMobile ? "bottom" : "right"}
                  sideOffset={8}
                >
                  {currentTip}
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
          <TableMain<Jobs> table={table} />
          <TablePagination<Jobs>
            limit={limit}
            page={page}
            table={table}
            total={jobs.data?.total}
          />
        </>
      )}
    </div>
  );
}
