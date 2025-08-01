import { Frown } from "lucide-react";
import Link from "next/link";

export default function NotFoundResultPage() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Frown className="size-32 text-muted-foreground" />
        <div className="flex flex-col items-center text-center gap-2">
          <h1 className="text-4xl font-semibold">No results found</h1>
          <p className="text-muted-foreground  text-lg">
            Please go{" "}
            <Link href={"/applier/dashboard/jobs"} className="underline hover:text-primary">
              back
            </Link>{" "}
            to dashboard and try again{" "}
          </p>
        </div>
      </div>
    </div>
  );
}
