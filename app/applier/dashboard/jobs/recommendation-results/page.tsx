"use client";

import { Confetti, ConfettiRef } from "@/components/magicui/confetti";
import NotFound from "@/components/NotFound";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { formatSalaryRangePublic } from "@/helpers/concurrency-converter";
import { cn } from "@/lib/utils";
import { useRecommendationJobStore } from "@/shared-api/stores/useRecommendationJobStore";
import { IconCash } from "@tabler/icons-react";
import confetti from "canvas-confetti";
import { Building2, MapPin, Sparkles } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import React, { useEffect, useRef } from "react";

function getRankColor(index: number) {
  switch (index) {
    case 0:
      return "bg-gradient-to-br from-sky-400 to-indigo-600 text-white   hover:bg-gradient-to-br hover:from-sky-500 hover:to-indigo-700 "; // #1
    case 1:
      return "bg-gradient-to-br from-sky-700 to-indigo-800 text-white shadow-xs hover:bg-gradient-to-br hover:from-sky-800 hover:to-indigo-900 "; // #2
    case 2:
      return "bg-gradient-to-br from-sky-900 to-indigo-900 text-white shadow-xs hover:bg-gradient-to-br hover:from-sky-900 hover:to-indigo-900 "; // #3
    default:
      return "bg-muted text-muted-foreground";
  }
}

export default function RecommendedJobsPages() {
  const jobRecommendationData = useRecommendationJobStore(
    (state) => state.jobRes
  );
  const confettiRef = useRef<ConfettiRef>(null);
  const fireWorks = () => {
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
    const randomInRange = (min: number, max: number) =>
      Math.random() * (max - min) + min;
    const interval = window.setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) {
        return clearInterval(interval);
      }
      const particleCount = 50 * (timeLeft / duration);
      confettiRef.current?.fire({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0, 0.3), y: Math.random() - 0.2 },
      });
      confettiRef.current?.fire({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);
  };
  useEffect(() => {
    if(jobRecommendationData.recommendedJobs > 0){
      fireWorks()
    }
  }, [ jobRecommendationData.recommendedJobs]);



  if(jobRecommendationData.recommendedJobs === 0){
    return notFound();
  }
  return (
    <div  className="space-y-6"  >
       <Confetti
        ref={confettiRef}
        manualstart
        className="absolute left-0 top-0 z-0 size-full"/> 
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-sky-400" />
            <p
              className={cn(
                "bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-sky-600"
              )}
            >
              Recommendations Ready!
            </p>
          </CardTitle>
          <CardDescription>
            Found {jobRecommendationData.recommendedJobs} matching jobs out of{" "}
            {jobRecommendationData.totalJobs} available positions
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Job Recommendations */}
      <div className="grid gap-6">
        {jobRecommendationData.recommendations.map((job, index) => (
          <Card key={job.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge className={cn("text-xs", getRankColor(index))}>
                      #{index + 1}
                    </Badge>
                    <h3 className="text-xl font-semibold">{job.role.name}</h3>
                  </div>
                  <div className="flex items-center gap-4 text-muted-foreground text-sm  ">
                    <Badge
                      variant={"secondary"}
                      className="flex items-center gap-1"
                    >
                      <Building2 className="h-4 w-4" />
                      {job.company.name}
                    </Badge>
                    <Badge
                      variant={"secondary"}
                      className="flex items-center text-muted-foreground gap-1"
                    >
                      <MapPin className="h-4 w-4" />
                      {job.location}
                    </Badge>
                  </div>
                </div>
                <div className="text-right space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Match:</span>
                    <Badge variant={"outline"}>{job.matchPercentage}%</Badge>
                  </div>
                  <Progress value={job.matchPercentage} className="w-20" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="  leading-relaxed text-sm">{job.description}</p>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 ">
                  <IconCash className="h-4 w-4" />
                  <span className="font-medium text-sm">
                    {formatSalaryRangePublic(job.salaryRange)}
                  </span>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/applier/dashboard/jobs/${job.id}`}>
                    View Details
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center flex-wrap">
        <Button variant="outline" disabled>
          Upload New Resume (Coming so soon)
        </Button>
        <Button disabled>Save Recommendations (Coming so soon)</Button>
      </div>
    </div>
  );
}
