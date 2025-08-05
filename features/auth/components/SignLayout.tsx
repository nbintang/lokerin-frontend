import { Button } from "@/components/ui/button";
import { IconBrandAirtable } from "@tabler/icons-react";
import { ChevronsLeft, GalleryVerticalEnd } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const SignLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="grid min-h-svh lg:grid-cols-2 relative">
      <Button
        className="lg:hidden absolute top-4 left-0"
        variant={"link"}
        asChild
      >
        <Link href={"/"}> 
          <ChevronsLeft className="size-5" />
          Go Back
        </Link>
      </Button>
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Button variant={"link"} asChild>
            <Link href="/" className="flex items-center gap-2 font-medium">
              <div className="size-8 rounded-lg ml-3 bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground">
                <IconBrandAirtable />
              </div>
              <span className="text-base font-semibold dark:text-white">
                {" "}
                Lokerin.
              </span>
            </Link>
          </Button>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <Image
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D.jpg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
          fill
          priority
        />
      </div>
    </main>
  );
};

export default SignLayout;
