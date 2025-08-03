"use client";

import { UserGrowthChart } from "@/features/administrator/components/UserGrowthChart";
import { StatsCard } from "@/features/administrator/components/StatsCard";
import { useUsers } from "@/shared-api/hooks/users/useUsers";
import { useRecruiters } from "@/shared-api/hooks/recruiters/useRecruiters";
import { useJobApplicants } from "@/shared-api/hooks/job-applicants/useJobApplicants";
import { useJobs } from "@/shared-api/hooks/jobs/useJobs";
import { DashboardSkeleton } from "@/features/administrator/components/DashboardSkeleton";
import { ErrorDisplay } from "@/features/administrator/components/DashboardError";
 
 


export default function AdminDashboardPage() {
  const { data: users, ...usersQuery } = useUsers({
    limit: 1000,
  });
  const { data: recruiters, ...recruitersQuery } = useRecruiters({
    limit: 100,
  });
  const { data: applicants, ...applicantsQuery } = useJobApplicants({
    limit: 100,
  });
  const { data: job, ...jobsQuery } = useJobs({
    isPublic: true,
  });

  const isLoading =
    usersQuery.isLoading ||
    recruitersQuery.isLoading ||
    applicantsQuery.isLoading ||
    jobsQuery.isLoading;

  const isError =
    usersQuery.isError ||
    !users ||
    recruitersQuery.isError ||
    !recruiters ||
    applicantsQuery.isError ||
    !applicants ||
    jobsQuery.isError ||
    !job;
  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (isError) {
    return <ErrorDisplay />;
  }

   return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <StatsCard
        users={users}
        recruiters={recruiters}
        applicants={applicants}
        jobs={job}
      />
      <div className="px-4 lg:px-6">
        <UserGrowthChart users={users.users} />
      </div>
    </div>
  );
}