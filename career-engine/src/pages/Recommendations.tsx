import React, { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { PageTransition } from "@/components/PageTransition";
import { NavBar } from "@/components/NavBar";
import { useAppContext } from "@/lib/context";
import { getCareerById } from "@/data/careers";
import { getRecommendations, RecommendationResult } from "@/lib/api";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Recommendations() {
  const [, setLocation] = useLocation();
  const { skills, interests, careerGoal, setSelectedCareer } = useAppContext();
  const [recommendations, setRecommendations] = useState<RecommendationResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const shouldFetch = skills.length > 0 || interests.length > 0 || careerGoal.length > 0;
    if (!shouldFetch) {
      setRecommendations([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    getRecommendations({ skills, interests, careerGoal })
      .then((result) => setRecommendations(result))
      .catch((err) => setError(String(err)))
      .finally(() => setIsLoading(false));
  }, [skills, interests, careerGoal]);

  const handleSelect = (careerId: string) => {
    const career = getCareerById(careerId);
    if (!career) {
      return;
    }
    setSelectedCareer(career);
    setLocation("/analysis");
  };

  const getInsight = (item: RecommendationResult) => {
    if (item.matchScore > 80) {
      return "Strong fit — your profile already aligns well.";
    }
    if (item.survivalScore < 50) {
      return "Challenging fit — focus on resilience and work-style alignment.";
    }
    return "Balanced option with room to improve your readiness.";
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  return (
    <PageTransition>
      <NavBar />
      <div className="flex-1 py-12 px-4 md:px-6">
        <div className="container max-w-6xl mx-auto space-y-12">
          <div className="space-y-4 text-center max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight">Your Career Matches</h1>
            <p className="text-lg text-muted-foreground">
              Based on our analysis of your profile, here are the top three career recommendations from the backend engine.
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 lg:gap-8">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="h-96 rounded-3xl border border-border bg-card/50 animate-pulse" />
              ))}
            </div>
          ) : error ? (
            <div className="rounded-3xl border border-destructive/20 bg-destructive/10 p-12 text-center text-destructive">
              {error}
            </div>
          ) : recommendations.length === 0 ? (
            <div className="rounded-3xl border border-border bg-card/80 p-12 text-center text-lg text-foreground/80">
              We couldn’t find a strong match — try adjusting your inputs.
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-4 gap-6 lg:gap-8"
            >
              {recommendations.map((item, index) => (
                <motion.div
                  key={item.careerId}
                  whileHover={{ scale: 1.02, y: -4 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className={
                    index === 0
                      ? "md:col-span-2 cursor-pointer"
                      : "cursor-pointer"
                  }
                  onClick={() => handleSelect(item.careerId)}
                >
                  <Card
                    className={
                      `h-full border transition-all duration-300 ${
                        index === 0
                          ? "bg-primary/5 border-primary/40 glow-amber"
                          : "bg-card/50 border-border hover:border-primary/50"
                      }`
                    }
                  >
                    <CardContent className="p-6 flex flex-col h-full">
                      <div className="flex items-center justify-between mb-4">
                        <Badge
                          variant="secondary"
                          className={
                            index === 0
                              ? "bg-emerald-500/10 text-emerald-500 font-semibold"
                              : "bg-secondary/50 text-secondary-foreground font-normal"
                          }
                        >
                          {index === 0 ? "Best Match" : `#${index + 1}`}
                        </Badge>
                        <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                          Rank
                        </span>
                      </div>
                      <h3 className={
                        `mb-4 font-bold ${index === 0 ? "text-3xl" : "text-xl"}`
                      }>{item.title}</h3>
                      <div className="space-y-3 mb-5">
                        <div className="flex items-center justify-between text-sm text-foreground/80">
                          <span>Match</span>
                          <span className="font-semibold">{item.matchScore}%</span>
                        </div>
                        <div className="flex items-center justify-between text-sm text-foreground/80">
                          <span>Survival</span>
                          <span className="font-semibold">{item.survivalScore}%</span>
                        </div>
                        <div className="flex items-center justify-between text-sm text-foreground/80">
                          <span>Final Score</span>
                          <span className="font-semibold">{item.finalScore}%</span>
                        </div>
                      </div>
                      <div className="rounded-2xl bg-background/70 border border-border/50 p-4 mb-5">
                        <p className="text-sm font-semibold text-foreground mb-2">Why this fits you</p>
                        <p className="text-sm text-muted-foreground">{item.reason || getInsight(item)}</p>
                        {item.matchedSkills && item.matchedSkills.length > 0 && (
                          <p className="text-sm text-emerald-500 mt-2">
                            <span className="font-semibold">Matched:</span> {item.matchedSkills.join(", ")}
                          </p>
                        )}
                      </div>
                      <div className="rounded-2xl bg-background/70 border border-border/50 p-4 mb-5 text-sm text-foreground/90">
                        <p className="font-semibold text-foreground mb-2">Next Steps & Gaps</p>
                        <p className="text-rose-500 mb-2">
                          <span className="font-semibold text-foreground">Missing Skills:</span> {item.missingSkills && item.missingSkills.length > 0 ? item.missingSkills.join(", ") : "No major gaps detected."}
                        </p>
                        <p className="text-muted-foreground mb-2">
                          <span className="font-semibold">Time:</span> {item.readinessTime}
                        </p>
                        <p className="text-muted-foreground">
                          <span className="font-semibold">Difficulty:</span> {item.difficulty}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-4 text-xs">
                        {item.survivalScore < 50 && (
                          <Badge variant="destructive" className="bg-rose-500/10 text-rose-500 border-rose-500/20">
                            Warning
                          </Badge>
                        )}
                        {item.matchScore > 80 && (
                          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                            High Potential
                          </Badge>
                        )}
                      </div>
                      <Button variant="outline" className="mt-auto w-full">
                        View Full Analysis →
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}

          <div className="flex justify-center mt-12">
            <Button variant="ghost" onClick={() => setLocation("/entry")} className="text-muted-foreground">
              <ArrowLeft className="w-4 h-4 mr-2" /> Start Over
            </Button>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
