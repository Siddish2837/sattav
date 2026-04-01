import React from "react";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";

interface RoadmapTimelineProps {
  steps: Array<{ month: string; step: string }>;
}

export function RoadmapTimeline({ steps }: RoadmapTimelineProps) {
  return (
    <div className="relative border-l border-primary/20 ml-3 md:ml-6 pl-6 py-2 space-y-8">
      {steps.map((step, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          viewport={{ once: true, margin: "-50px" }}
          className="relative"
        >
          <div className="absolute -left-[35px] top-1 w-5 h-5 rounded-full bg-background border-2 border-primary flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-primary" />
          </div>
          
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-sm font-medium text-primary">
              <Calendar className="w-4 h-4" />
              {step.month}
            </div>
            <p className="text-foreground/90 leading-relaxed bg-card/30 p-4 rounded-lg border border-border/50">
              {step.step}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
