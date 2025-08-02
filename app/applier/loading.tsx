import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="flex items-center gap-4">
        <p className="text-muted-foreground text-xl">Loading</p>
        <Loader2 className="animate-spin text-primary text-lg" />
      </div>
    </div>
  );
}
