import React from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart, Bell, Building, FileText, Layers, Search, Shield, Sparkles, Star, Users, Zap } from "lucide-react";
import { ShinyText } from "@/components/ShinyText";
import { CalendarIcon, FileTextIcon } from "@radix-ui/react-icons";
import { BellIcon, Share2Icon } from "lucide-react";

import { cn } from "@/lib/utils";
import { BentoCard, BentoGrid } from "@/components/magicui/bento-grid";
import { Marquee } from "@/components/magicui/marquee";
import Image from "next/image";
const features = [
  {
    Icon: Search,
    name: "Smart Job Search",
    description:
      "Advanced AI-powered search with intelligent filters for location, salary, experience, and skills to find perfect job matches.",
    href: "#",
    cta: "Explore Jobs",
    className: "lg:row-start-1 lg:row-end-3 lg:col-start-3 lg:col-end-3", // Kolom 3 (kanan)
    background: <Image src={"/gifs/howtouse.gif"} alt="job search" fill className="absolute -right-20 object-cover object-right -top-20 opacity-60" />,
  },
  {
    name: "Resume Management",
    description:
      "Automated resume parsing, CV analysis, and smart candidate matching with skill extraction and qualification scoring.",
    Icon: FileText,
    href: "#",
    cta: "Upload Resume",
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-2", // Kolom 1 (kiri)
    background: <Image src={"/gifs/manage.gif"} alt="resume management" fill className="absolute -right-20 object-cover object-center -top-20 opacity-60" />,
  },
  {
       name: "Enterprise Security",
    description:
      "Keep your data safe with end-to-end encryption and compliance features.",
    Icon: Shield,
    href: "#",
    cta: "Track Applications",
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-2 lg:row-end-2", // Kolom 1 (kiri)
    background: <Image src={"/gifs/lock.gif"} alt="application tracking" fill={true} className="absolute -right-20 object-cover w-full h-full object-center-top-20 opacity-60" />,
  },
  {
    name: "Employer Dashboard",
    description:
      "Comprehensive recruiter portal with job posting, candidate management, analytics, and communication tools.",
    Icon: Building,
    className: "lg:col-start-2 lg:col-end-2 lg:row-start-1 lg:row-end-2", // Kolom 2 (tengah)
    href: "#",
    cta: "Post Jobs",
    background: <Image src={"/gifs/shakehands.gif"} alt="employer dashboard" fill={true} className="absolute -right-20 object-cover w-full h-full object-center-top-20 opacity-60" />,
  },
  {
    name: "Real-time Notifications",
    description:
      "Instant job alerts, application updates, and messaging system for seamless communication between employers and candidates.",
    Icon: Bell,
    className: "lg:col-start-2 lg:col-end-2 lg:row-start-2 lg:row-end-2", // Kolom 2 (tengah)
    href: "#",
    cta: "Enable Alerts",
    background: <Image src={"/gifs/mail.gif"} alt="notifications" fill={true} className="absolute -right-20 object-cover w-full h-full object-center-top-20 opacity-60" />,
  },
];
export function BentoDemo() {
  return (
    <BentoGrid>
      {features.map((feature, idx) => (
        <BentoCard key={idx} {...feature} />
      ))}
    </BentoGrid>
  );
}
export const Features = () => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <section
      id="features"
      className="w-full flex items-center justify-center py-20 md:py-32"
    >
      <div className="container px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
        >
          <Badge
            className="rounded-full px-4 py-1.5 text-sm font-medium"
            variant="secondary"
          >
            <ShinyText text="Features" disabled={false} />
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Everything You Need to Succeed
          </h2>
          <p className="max-w-[800px] text-muted-foreground md:text-lg">
            Our comprehensive platform provides all the tools you need to
            streamline your workflow, boost productivity, and achieve your
            goals.
          </p>
        </motion.div>

        <BentoDemo />
      </div>
    </section>
  );
};
