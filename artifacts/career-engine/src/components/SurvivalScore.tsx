import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface SurvivalScoreProps {
  score: number;
}

export function SurvivalScore({ score }: SurvivalScoreProps) {
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = score;
    if (start === end) return;

    let totalDuration = 1500;
    let incrementTime = (totalDuration / end);

    let timer = setInterval(() => {
      start += 1;
      setDisplayScore(start);
      if (start === end) clearInterval(timer);
    }, incrementTime);

    return () => clearInterval(timer);
  }, [score]);

  const getColor = () => {
    if (score >= 75) return "text-emerald-500";
    if (score >= 50) return "text-amber-500";
    return "text-red-500";
  };

  const getStrokeColor = () => {
    if (score >= 75) return "#10B981";
    if (score >= 50) return "#F59E0B";
    return "#EF4444";
  };

  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center w-40 h-40 mx-auto">
      <svg className="transform -rotate-90 w-full h-full" viewBox="0 0 140 140">
        <circle
          className="text-muted/30"
          strokeWidth="10"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="70"
          cy="70"
        />
        <motion.circle
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          stroke={getStrokeColor()}
          strokeWidth="10"
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx="70"
          cy="70"
          style={{ strokeDasharray: circumference }}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className={`text-4xl font-bold ${getColor()}`}>
          {displayScore}
        </span>
        <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
          Score
        </span>
      </div>
    </div>
  );
}
