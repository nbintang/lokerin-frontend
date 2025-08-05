import React from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { AnimatedGradientText } from "@/components/magicui/animated-gradient-text";
import { IconSparkles } from "@tabler/icons-react";
import DarkVeil from "@/components/DarkVeil";
import { ShinyText } from "@/components/ShinyText";

export const Hero = () => {
  return (
    <section className="w-full flex items-center justify-center py-20 md:py-32 lg:py-40 overflow-hidden">
      <div className="absolute top-0 inset-0  hidden md:block dark:block -z-10 h-full w-full">
        <DarkVeil />
      </div>
      <div className="container px-4 md:px-6 relative b  ">
        <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-black bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-12    "
        >
          <Badge
            className="mb-4 rounded-full px-4 py-1.5 text-sm font-medium"
            variant="secondary"
          >
            <ShinyText text="AI Powered" disabled={false} />
          </Badge>
          <h1 className="text-4xl  md:text-5xl lg:text-6xl font-bold tracking-tight mb-6     ">
            <ShinyText
              text="Smart Job Matching with Lokerin"
               
            />
          </h1>
          <p className="text-base md:text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Lokerin is an AI-powered recruitment platform that connects talent
            with the right opportunities. Whether you&apos;re hiring or
            job-seeking, our smart recommendations and seamless tools make the
            process faster, easier, and more personalized.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="rounded-full h-12 px-8 text-base"
              asChild
            >
              <Link href={"/auth/signin"}>
                Start Free Trial
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full h-12 px-8 text-base"
              asChild
            >
              <Link href={"/auth/signin"}>
                <AnimatedGradientText>Try AI Features</AnimatedGradientText>{" "}
                <IconSparkles className="ml-2 size-4 text-sky-500 " />
              </Link>
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative mx-auto max-w-5xl"
        >
          <div className="rounded-xl overflow-hidden shadow-2xl border border-border/40 bg-gradient-to-b from-background to-muted/20">
            <video
              src="/videos/software.mp4"
              width={1280}
              height={720}
              className="w-full h-auto"
              autoPlay
              muted
              loop
              playsInline
            />

            <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-black/10 dark:ring-white/10"></div>
          </div>
          <div className="absolute -bottom-6 -right-6 -z-10 h-[300px] w-[300px] rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 blur-3xl opacity-70"></div>
          <div className="absolute -top-6 -left-6 -z-10 h-[300px] w-[300px] rounded-full bg-gradient-to-br from-secondary/30 to-primary/30 blur-3xl opacity-70"></div>
        </motion.div>
      </div>
    </section>
  );
};
