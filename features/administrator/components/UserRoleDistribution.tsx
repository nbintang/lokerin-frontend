"use client";

import { PieChart, Pie, Tooltip, Cell } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { User } from "@/shared-api/hooks/users/useUsers";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface UserRoleDistributionProps {
  users: User[];
}

const COLORS = ["#a1a1aa", "#d4d4d8"]; // abu gelap dan terang

const chartConfig = {
  members: { label: "Members", color: "var(--primary)" },
  recruiters: { label: "Recruiters", color: "var(--primary)"},
};

export function UserRoleDistribution({ users }: UserRoleDistributionProps) {
  const roleData = users.reduce((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = [
    { role: "Members", count: roleData.MEMBER || 0 },
    { role: "Recruiters", count: roleData.RECRUITER || 0 },
  ];

  const total = chartData.reduce((sum, item) => sum + item.count, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Distribution by Role</CardTitle>
        <CardDescription>Total users: {total}</CardDescription>
      </CardHeader>
      <CardContent className=" pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="role"
              cx="50%"
              cy="50%"
              outerRadius={90} 
              strokeWidth={1} 
              label={({ role, count, percent }) =>
                `${role}: ${count} (${(percent * 100).toFixed(1)}%)`
              }
              labelLine={false}
            >
              {chartData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
