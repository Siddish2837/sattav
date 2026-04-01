import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Target, TrendingUp, ArrowRight } from "lucide-react";
import { Career, RecommendationInfo } from "@/lib/context";

interface CareerCardProps {
  info: RecommendationInfo;
  type: "safe" | "balanced" | "dream";
  onClick: () => void;
}

export function CareerCard({ info, type, onClick }: CareerCardProps) {
  const { career, score } = info;
  
  const getScoreColor = () => {
    if (score >= 80) return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
    if (score >= 60) return "text-amber-500 bg-amber-500/10 border-amber-500/20";
    return "text-red-500 bg-red-500/10 border-red-500/20";
  };

  const getTypeLabel = () => {
    switch (type) {
      case "safe": return { label: "Safe Bet", icon: <Target className="w-3 h-3 mr-1" />, color: "bg-blue-500/10 text-blue-500 border-blue-500/20" };
      case "balanced": return { label: "Balanced Fit", icon: <Briefcase className="w-3 h-3 mr-1" />, color: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20" };
      case "dream": return { label: "Dream Career", icon: <TrendingUp className="w-3 h-3 mr-1" />, color: "bg-purple-500/10 text-purple-500 border-purple-500/20" };
    }
  };

  const typeConfig = getTypeLabel();

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onClick={onClick}
      className="cursor-pointer h-full"
      data-testid={`card-recommendation-${type}`}
    >
      <Card className="h-full bg-card/50 backdrop-blur-sm border-white/10 hover:border-primary/50 transition-colors duration-300">
        <CardContent className="p-6 flex flex-col h-full">
          <div className="flex justify-between items-start mb-4">
            <Badge variant="outline" className={`flex items-center px-2 py-1 border ${typeConfig.color}`}>
              {typeConfig.icon}
              {typeConfig.label}
            </Badge>
            <div className={`flex flex-col items-end px-3 py-1 rounded-lg border ${getScoreColor()}`}>
              <span className="text-2xl font-bold leading-none">{score}%</span>
              <span className="text-[10px] uppercase font-semibold tracking-wider opacity-80">Match</span>
            </div>
          </div>
          
          <h3 className="text-xl font-bold mb-2 text-foreground">{career.title}</h3>
          
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="secondary" className="bg-secondary/50 text-secondary-foreground font-normal">
              ${(career.salary.min / 1000).toFixed(0)}k - ${(career.salary.max / 1000).toFixed(0)}k
            </Badge>
            <Badge variant="secondary" className="bg-secondary/50 text-secondary-foreground font-normal">
              {career.demand} Demand
            </Badge>
          </div>
          
          <p className="text-sm text-muted-foreground line-clamp-3 mb-6 flex-grow">
            {career.explanation}
          </p>
          
          <div className="flex items-center text-sm font-medium text-primary mt-auto group">
            View full analysis 
            <ArrowRight className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
