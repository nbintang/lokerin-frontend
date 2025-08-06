import { Skeleton } from "../ui/skeleton";
import { Card, CardAction, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function SectionCardSkeleton() {
  return (
    <Card className="@container/card w-full">
      <CardHeader>
        <Skeleton className="h-7 w-1/3 md:w-1/12" />
        <CardTitle className="text-2xl font-semibold tabular-nums flex items-center @[250px]/card:text-3xl">
          <Skeleton className="size-12 rounded-full" />
        </CardTitle>
        <CardAction>
          <Badge variant="outline" className="rounno p-0">
            <Skeleton className="h-4 w-4 rounded-none" />
          </Badge>
        </CardAction>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <Skeleton className="h-4 w-1/3 md:w-1/12" />
      </CardFooter>
    </Card>
  );
}
