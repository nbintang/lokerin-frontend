"use client";

import { Hero } from "@/features/public/components/Hero";
import { Logos } from "@/features/public/components/Logos";
import { Features } from "@/features/public/components/Features";
import { HowItWorks } from "@/features/public/components/HowItWorks";
import { Testimonials } from "@/features/public/components/Testimonials";
import { Pricing } from "@/features/public/components/Pricing";
import { FAQ } from "@/features/public/components/FAQ";
import { CTA } from "@/features/public/components/CTA";

export default function LandingPage() {
  return (
    <>
      <div className="flex min-h-[100dvh] flex-col">
        <main className="flex-1 ">
          <Hero />
          <Logos />
          <Features />
          <HowItWorks />
          <Testimonials />
          <Pricing />
          <FAQ />
          <CTA />
        </main>
      </div>
    </>
  );
}
