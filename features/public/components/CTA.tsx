import { InteractiveGridPattern } from "@/components/magicui/interactive-grid-pattern";
import { cn } from "@/lib/utils";
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AnimatedGradientText } from "@/components/magicui/animated-gradient-text";
import { IconSparkles } from "@tabler/icons-react";
import { ShinyText } from "@/components/ShinyText";

export const CTA = () => {
  return (
    <section className="w-full py-20  md:py-32 flex items-center justify-center  text-primary-foreground relative overflow-hidden">
      <InteractiveGridPattern
        className={cn(
          "[mask-image:radial-gradient(240px_circle_at_right,white,transparent)]",
          "md:[mask-image:radial-gradient(240px_circle_at_center,white,transparent)]",
          "lg:inset-x-[-20%] inset-x-[20%] hidden dark:block inset-y-[-30%] h-[150%] skew-y-12"
        )}
        width={20}
        height={20}
        squares={[80, 80]}
        squaresClassName="hover:fill-blue-500 fill-sky-900/30"
      />
      <InteractiveGridPattern
        className={cn(
          "[mask-image:radial-gradient(240px_circle_at_left,white,transparent)]",
          "md:[mask-image:radial-gradient(240px_circle_at_center,white,transparent)]",
          "lg:inset-x-[20%] inset-x-[-20%] hidden dark:block inset-y-[-30%] h-[170%] -skew-y-12 "
        )}
        width={20}
        height={20}
        squares={[80, 80]}
        squaresClassName="hover:fill-blue-500 fill-indigo-800/30"
      />
      {/* <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div> */}

      <div className="container px-4 md:px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center space-y-6 text-center"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-primary">
            Ready to Transform Your Workflow?
          </h2>
          <p className="mx-auto max-w-[700px]  text-muted-foreground md:text-xl">
            Join thousands of satisfied customers who have streamlined their
            processes and boosted productivity with our platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Button
              size="lg"
              variant="secondary"
              className="rounded-full h-12 px-8 text-base"
              asChild
            >
              <Link href={"/auth/signin"}>
                <ShinyText text="Start Free Trial" disabled={false} />
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
          <p className="text-sm  text-muted-foreground mt-4">
            No credit card required. 14-day free trial. Cancel anytime.
          </p>
        </motion.div>
      </div>
    </section>
  );
};
