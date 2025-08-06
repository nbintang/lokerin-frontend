import { IconTrendingUp } from "@tabler/icons-react";
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface SectionCardProps {
  total: number ;
  userTitle?: string;
}

export function SectionCard({ total, userTitle }: SectionCardProps) {
  return (
    <Card className="@container/card w-full">
      <CardHeader>
        <CardDescription>Total {userTitle || "Applicants"}</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums flex items-center @[250px]/card:text-3xl">
          {total}
        </CardTitle>
        <CardAction>
          <Badge variant="outline">
            <IconTrendingUp />
            {total}%
          </Badge>
        </CardAction>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <div className="line-clamp-1 flex gap-2 font-medium">
          {userTitle || "Applicants"} for the last 6 months
          <IconTrendingUp className="size-4" />
        </div>
        <div className="text-muted-foreground">
          Your {userTitle || "Applicants"} for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
}
