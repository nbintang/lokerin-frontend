import React from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { ShinyText } from "../../../components/ShinyText";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
const testismonials = [
  {
    quote:
      "Lokerin has transformed how we manage our projects. The automation features have saved us countless hours of manual work.",
    author: "Sarah Johnson",
    role: "Project Manager, TechCorp",
    rating: 5,
    images: "/testimonials/image7.png",
  },
  {
    quote:
      "The analytics dashboard provides insights we never had access to before. It's helped us make data-driven decisions that have improved our ROI.",
    author: "Michael Chen",
    role: "Marketing Director, GrowthLabs",
    rating: 5,
    images: "/testimonials/image6.png",
  },
  {
    quote:
      "Customer support is exceptional. Any time we've had an issue, the team has been quick to respond and resolve it. Couldn't ask for better service.",
    author: "Emily Rodriguez",
    role: "Operations Lead, StartupX",
    rating: 5,
    images: "/testimonials/image4.png",
  },
  {
    quote:
      "We've tried several similar solutions, but none compare to the ease of use and comprehensive features of Lokerin. It's been a game-changer.",
    author: "David Kim",
    role: "CEO, InnovateNow",
    rating: 5,
    images: "/testimonials/image5.png",
  },
  {
    quote:
      "The collaboration tools have made remote work so much easier for our team. We're more productive than ever despite being spread across different time zones.",
    author: "Kim Jong Un",
    role: "HR Director, RemoteFirst",
    rating: 5,
    images: "/testimonials/image3.png",
  },
  {
    quote:
      "Implementation was seamless, and the ROI was almost immediate. We've reduced our operational costs by 30% since switching to Lokerin.",
    author: "James Wilson",
    role: "COO, ScaleUp Inc",
    rating: 5,
    images: "/testimonials/image2.png",
  },
];
export const Testimonials = () => {
  return (
    <section
      id="testimonials"
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
            <ShinyText text="Testimonials" disabled={false} />
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Loved by Teams Worldwide
          </h2>
          <p className="max-w-[800px] text-muted-foreground md:text-lg">
            Don&apos;t just take our word for it. See what our customers have to
            say about their experience.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testismonials.map((testimonial, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
            >
              <Card className="h-full overflow-hidden border-border/40 bg-gradient-to-b from-background to-muted/10 backdrop-blur transition-all hover:shadow-md">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="flex mb-4">
                    {Array(testimonial.rating)
                      .fill(0)
                      .map((_, j) => (
                        <Star
                          key={j}
                          className="size-4 text-yellow-500 fill-yellow-500"
                        />
                      ))}
                  </div>
                  <p className="text-lg mb-6 flex-grow">{testimonial.quote}</p>
                  <div className="flex items-center gap-4 mt-auto pt-4 border-t border-border/40">
                    <Avatar className="size-10">
                      <AvatarImage
                        src={testimonial.images}
                        alt={testimonial.author}
                        className="object-cover"
                      />
                      <AvatarFallback>
                        {testimonial.author.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{testimonial.author}</p>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
