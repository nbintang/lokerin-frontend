import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="grid place-items-center min-h-screen bg-background px-4">
      <div className="flex flex-col items-center gap-4 animate-fade-in">
        <Loader2 className="animate-spin text-primary w-14 h-14" />
        <p className="text-muted-foreground text-lg tracking-wide text-center">
          Loading, please wait...
        </p>
      </div>
    </div>
  );
}
