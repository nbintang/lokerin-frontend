"use client";

import { useState } from "react";
import {
  Search,
  BookOpen,
  Users,
  CreditCard,
  Settings,
  MessageCircle,
  Phone,
  Mail,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { IconBrandWhatsapp } from "@tabler/icons-react";

const helpCategories = [
  {
    id: "getting-started",
    title: "Getting Started",
    icon: BookOpen,
    description: "Learn the basics of using our recruitment platform",
    articles: [
      {
        title: "Setting up your company profile",
        views: "2.1k",
        time: "5 min read",
      },
      {
        title: "Creating your first job posting",
        views: "1.8k",
        time: "3 min read",
      },
      {
        title: "Understanding candidate matching",
        views: "1.5k",
        time: "4 min read",
      },
      { title: "Navigating the dashboard", views: "1.2k", time: "2 min read" },
    ],
  },
  {
    id: "job-management",
    title: "Job Management",
    icon: Users,
    description: "Everything about posting and managing job listings",
    articles: [
      {
        title: "How to write effective job descriptions",
        views: "3.2k",
        time: "8 min read",
      },
      { title: "Managing job applications", views: "2.7k", time: "6 min read" },
      {
        title: "Setting up interview scheduling",
        views: "1.9k",
        time: "5 min read",
      },
      {
        title: "Closing and archiving positions",
        views: "1.1k",
        time: "3 min read",
      },
    ],
  },
  {
    id: "billing",
    title: "Billing & Plans",
    icon: CreditCard,
    description: "Subscription management and billing questions",
    articles: [
      {
        title: "Understanding pricing plans",
        views: "2.5k",
        time: "4 min read",
      },
      {
        title: "Upgrading or downgrading your plan",
        views: "1.8k",
        time: "3 min read",
      },
      { title: "Managing payment methods", views: "1.4k", time: "2 min read" },
      { title: "Viewing billing history", views: "1.0k", time: "2 min read" },
    ],
  },
  {
    id: "account-settings",
    title: "Account & Settings",
    icon: Settings,
    description: "Account management and platform configuration",
    articles: [
      {
        title: "Managing team members and permissions",
        views: "2.1k",
        time: "6 min read",
      },
      {
        title: "Customizing notification preferences",
        views: "1.6k",
        time: "4 min read",
      },
      { title: "Setting up integrations", views: "1.3k", time: "7 min read" },
      {
        title: "Data export and privacy settings",
        views: "0.9k",
        time: "5 min read",
      },
    ],
  },
];

const popularArticles = [
  {
    title: "How to attract top talent with your job postings",
    category: "Job Management",
    views: "5.2k",
  },
  {
    title: "Best practices for candidate screening",
    category: "Getting Started",
    views: "4.8k",
  },
  {
    title: "Setting up automated email responses",
    category: "Account & Settings",
    views: "3.9k",
  },
  {
    title: "Understanding our pricing structure",
    category: "Billing & Plans",
    views: "3.5k",
  },
  {
    title: "Integrating with your existing HR tools",
    category: "Account & Settings",
    views: "3.1k",
  },
];

const contactOptions = [
  {
    title: "Live Chat",
    description: "Get instant help from our support team",
    icon: IconBrandWhatsapp,
    availability: "Available 24/7",
    action: "Start Chat",
  },
  {
    title: "Phone Support",
    description: "Speak directly with a support specialist",
    icon: Phone,
    availability: "Mon-Fri, 9AM-6PM EST",
    action: "Call Now",
  },
  {
    title: "Email Support",
    description: "Send us a detailed message about your issue",
    icon: Mail,
    availability: "Response within 24 hours",
    action: "Send Email",
  },
];

export default function GetHelpPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
   

      <div className="container mx-auto px-4 py-12">
        <div className="">
    
 

          {/* Contact Support */}
          <section className="mb-16">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold mb-2">Still need help?</h2>
              <p className="text-muted-foreground">
                Our support team is here to help you succeed
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {contactOptions.map((option, index) => (
                <Card
                  key={index}
                  className="text-center hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="p-3 bg-primary/10 rounded-full w-fit mx-auto mb-4">
                      <option.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">{option.title}</h3>
                    <p className="text-muted-foreground text-sm mb-3">
                      {option.description}
                    </p>
                    <p className="text-xs text-muted-foreground mb-4">
                      {option.availability}
                    </p>
                    <Button className="w-full">{option.action}</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

 
        </div>
      </div>
    </div>
  );
}
