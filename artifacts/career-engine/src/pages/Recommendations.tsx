import React from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { PageTransition } from "@/components/PageTransition";
import { NavBar } from "@/components/NavBar";
import { CareerCard } from "@/components/CareerCard";
import { useAppContext, Career } from "@/lib/context";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Recommendations() {
  const [, setLocation] = useLocation();
  const { recommendations, setSelectedCareer, resetState } = useAppContext();

  const handleSelect = (career: Career) => {
    setSelectedCareer(career);
    setLocation("/analysis");
  };

  // Prevent crash if refreshed
  if (!recommendations.safe || !recommendations.balanced || !recommendations.dream) {
    setLocation("/");
    return null;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  return (
    <PageTransition>
      <NavBar />
      <div className="flex-1 py-12 px-4 md:px-6">
        <div className="container max-w-6xl mx-auto space-y-12">
          <div className="space-y-4 text-center max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight">Your Career Matches</h1>
            <p className="text-lg text-muted-foreground">
              Based on our analysis of your profile, here are the top three paths we recommend. Select one to view the detailed survival analysis and roadmap.
            </p>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
          >
            <CareerCard 
              type="safe" 
              info={recommendations.safe} 
              onClick={() => handleSelect(recommendations.safe!.career)} 
            />
            <CareerCard 
              type="balanced" 
              info={recommendations.balanced} 
              onClick={() => handleSelect(recommendations.balanced!.career)} 
            />
            <CareerCard 
              type="dream" 
              info={recommendations.dream} 
              onClick={() => handleSelect(recommendations.dream!.career)} 
            />
          </motion.div>
          
          <div className="flex justify-center mt-12">
            <Button variant="ghost" onClick={() => { resetState(); setLocation("/entry"); }} className="text-muted-foreground">
              <ArrowLeft className="w-4 h-4 mr-2" /> Start Over
            </Button>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
