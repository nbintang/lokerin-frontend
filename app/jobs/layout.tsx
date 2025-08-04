import { Button } from "@/components/ui/button";
import { IconSparkles } from "@tabler/icons-react";
import Link from "next/link";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-end flex-wrap">
          <div>
            <h1 className="text-3xl font-bold mb-2">Find Your Dream Job</h1>
            <p>Discover opportunities that match your skills and interests</p>
          </div>
          <Button className="mt-4" variant="special" asChild>
            <Link href="/auth/signin">
              <IconSparkles />
              Try AI Recommendation
            </Link>
          </Button>
        </div>
        {children}
      </div>
    </div>
  );
}
