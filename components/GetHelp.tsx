"use client";

import { useState } from "react";
import {
  Phone,
  Mail
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent
} from "@/components/ui/card";
import { IconBrandWhatsapp } from "@tabler/icons-react";

 
 

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
