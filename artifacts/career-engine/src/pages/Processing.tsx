import React, { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Cpu } from "lucide-react";
import { PageTransition } from "@/components/PageTransition";
import { useAppContext } from "@/lib/context";
import { CAREERS } from "@/data/careers";
import { calculateMatchScore, computeSkillScore, computeInterestScore, computeGoalScore } from "@/logic/match";

const STEPS = [
  "Analyzing your profile...",
  "Matching career paths...",
  "Running survival analysis...",
  "Generating your report..."
];

export default function Processing() {
  const [, setLocation] = useLocation();
  const { skills, interests, careerGoal, setRecommendations } = useAppContext();
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Process recommendations
    const processData = () => {
      // Calculate scores for all careers
      const scoredCareers = CAREERS.map(career => {
        const skillScore = computeSkillScore(skills, career.requiredSkills);
        const interestScore = computeInterestScore(interests, career.domain, career.keywords);
        const goalScore = computeGoalScore(careerGoal, career.goalKeywords);
        
        const matchScore = calculateMatchScore({ skillScore, interestScore, goalScore });
        
        return { career, score: matchScore };
      }).sort((a, b) => b.score - a.score);

      // Find categories
      const dream = scoredCareers.find(c => c.career.type === "dream") || scoredCareers[0];
      const balanced = scoredCareers.find(c => c.career.type === "balanced" && c.career.id !== dream?.career.id) || scoredCareers[1];
      const safe = scoredCareers.find(c => c.career.type === "safe" && c.career.id !== dream?.career.id && c.career.id !== balanced?.career.id) || scoredCareers[2];

      setRecommendations({ safe, balanced, dream });
    };

    processData();

    // Sequence timing
    const stepDuration = 1500;
    let step = 0;
    
    const interval = setInterval(() => {
      step++;
      if (step < STEPS.length) {
        setCurrentStep(step);
      } else {
        clearInterval(interval);
        setLocation("/recommendations");
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, [skills, interests, careerGoal, setRecommendations, setLocation]);

  return (
    <PageTransition className="justify-center items-center bg-background relative overflow-hidden">
      {/* Background visual effects */}
      <div className="absolute inset-0 z-0 flex items-center justify-center opacity-10">
        <div className="w-[60vw] h-[60vw] border-[1px] border-primary rounded-full animate-[spin_60s_linear_infinite]" />
        <div className="absolute w-[40vw] h-[40vw] border-[1px] border-primary border-dashed rounded-full animate-[spin_40s_linear_infinite_reverse]" />
        <div className="absolute w-[20vw] h-[20vw] border-[1px] border-primary rounded-full animate-[spin_20s_linear_infinite]" />
      </div>

      <div className="z-10 flex flex-col items-center max-w-md w-full px-6">
        <div className="relative mb-12">
          <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center">
            <Cpu className="w-12 h-12 text-primary animate-pulse" />
          </div>
          {/* Orbital dots */}
          <motion.div 
            className="absolute inset-0 border border-primary/30 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <div className="absolute -top-1 left-1/2 w-3 h-3 bg-primary rounded-full transform -translate-x-1/2 shadow-[0_0_10px_var(--primary)]" />
          </motion.div>
        </div>

        <div className="h-8 relative w-full flex justify-center mb-8">
          <AnimatePresence mode="wait">
            <motion.h2
              key={currentStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-xl font-medium text-foreground absolute"
            >
              {STEPS[currentStep]}
            </motion.h2>
          </AnimatePresence>
        </div>

        <div className="w-full h-1 bg-secondary rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-primary"
            initial={{ width: "0%" }}
            animate={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
        </div>
      </div>
    </PageTransition>
  );
}
