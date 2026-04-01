import React from "react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

interface SkillChipProps {
  label: string;
  variant?: "success" | "neutral" | "danger";
  delay?: number;
}

export function SkillChip({ label, variant = "neutral", delay = 0 }: SkillChipProps) {
  const getStyles = () => {
    switch (variant) {
      case "success":
        return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
      case "danger":
        return "bg-red-500/15 text-red-400 border-red-500/30";
      case "neutral":
      default:
        return "bg-secondary border-border text-foreground";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay, type: "spring" }}
    >
      <Badge variant="outline" className={`px-3 py-1.5 text-sm font-medium rounded-full ${getStyles()}`}>
        {variant === "success" && <span className="mr-1.5">✅</span>}
        {variant === "danger" && <span className="mr-1.5">❌</span>}
        {label}
      </Badge>
    </motion.div>
  );
}
