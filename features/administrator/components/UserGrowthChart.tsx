"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, Line, XAxis } from "recharts";

import { useIsMobile } from "@/hooks/use-mobile";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { format } from "date-fns";
import { User } from "@/shared-api/hooks/users/useUsers";
import processUserData from "@/helpers/processUserData";

const chartConfig = {
  users: {
    label: "Users",
  },
  member: {
    label: "Members",
    color: "#0284c7",
  },
  recruiter: {
    label: "Recruiters",
    color: "#38bdf8",
  },
  total: {
    label: "Total Users",
    color: "#0369a1",
  },
} satisfies ChartConfig;

interface UserGrowthChartProps {
  users: User[];
  className?: string;
}

export function UserGrowthChart({ users, className }: UserGrowthChartProps) {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState("90d");
  const [viewType, setViewType] = React.useState<"cumulative" | "daily">(
    "cumulative"
  );

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("30d");
    }
  }, [isMobile]);

  const chartData = React.useMemo(() => {
    return processUserData(users);
  }, [users]);

  const filteredData = React.useMemo(() => {
    if (!chartData.length) return [];
    const lastDataDate = new Date(chartData[chartData.length - 1].date);
    let daysToSubtract = 90;
    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }
    const startDate = new Date(lastDataDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return chartData.filter((item) => {
      const date = new Date(item.date);
      return date >= startDate;
    });
  }, [chartData, timeRange]);

  const totalUsers = React.useMemo(() => {
    if (!filteredData.length) return { member: 0, recruiter: 0, total: 0 };
    const latest = filteredData[filteredData.length - 1];
    return {
      member: latest.member,
      recruiter: latest.recruiter,
      total: latest.total,
    };
  }, [filteredData]);

  return (
    <Card className={`@container/card ${className}`}>
      <CardHeader>
        <CardTitle>User Growth Analysis</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Total users: {totalUsers.total} (Members: {totalUsers.member},
            Recruiters: {totalUsers.recruiter})
          </span>
          <span className="@[540px]/card:hidden">
            {totalUsers.total} users total
          </span>
        </CardDescription>
        <CardAction className="flex flex-col gap-2 @[767px]/card:flex-row">
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
            <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
            <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select time range"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[450px] w-full  "
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillMember" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-member)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-member)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillRecruiter" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-recruiter)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-recruiter)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillTotal" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-total)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-total)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => format(new Date(value), "MMM dd")}
            />
            <ChartTooltip
              cursor={false}
              defaultIndex={isMobile ? -1 : Math.floor(filteredData.length / 2)}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) =>
                    format(new Date(value), "MMM dd yyyy")
                  }
                  indicator="dot"
                />
              }
            />

            <Area
              dataKey="member"
              type="natural"
              fill="url(#fillMember)"
              stroke="var(--color-member)"
              strokeWidth={2}
              stackId="a"
            />
            <Area
              dataKey="recruiter"
              type="natural"
              fill="url(#fillRecruiter)"
              stroke="var(--color-recruiter)"
              strokeWidth={2}
              stackId="a"
            />
            <Area
              dataKey="total"
              type="natural"
              fill="url(#fillTotal)"
              stroke="var(--color-total)"
              strokeWidth={2}
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
