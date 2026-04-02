import React from "react";
import { motion } from "framer-motion";

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  colorClass?: string;
}

export function ProgressBar({ value, max = 100, label, colorClass = "bg-primary" }: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between items-end mb-1">
          <span className="text-sm font-medium text-foreground">{label}</span>
          <span className="text-xs text-muted-foreground">{value}%</span>
        </div>
      )}
      <div className="h-2 w-full bg-secondary/50 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${colorClass === "bg-primary" ? "bg-gradient-to-r from-primary to-accent" : colorClass}`}
          initial={{ width: 0 }}
          whileInView={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          viewport={{ once: true }}
        />
      </div>
    </div>
  );
}
