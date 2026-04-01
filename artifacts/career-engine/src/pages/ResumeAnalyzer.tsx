import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Loader2, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SkillChip } from "@/components/SkillChip";
import { PageTransition } from "@/components/PageTransition";
import { NavBar } from "@/components/NavBar";
import { useAppContext } from "@/lib/context";
import { MOCK_RESUME_DATA } from "@/data/careers";

export default function ResumeAnalyzer() {
  const [, setLocation] = useLocation();
  const { setSkills, setInterests } = useAppContext();
  const [isParsing, setIsParsing] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsParsing(false);
      setSkills(MOCK_RESUME_DATA.skills);
      setInterests(MOCK_RESUME_DATA.interests.join(", "));
    }, 2500);
    return () => clearTimeout(timer);
  }, [setSkills, setInterests]);

  const handleContinue = () => {
    setLocation("/processing");
  };

  return (
    <PageTransition>
      <NavBar />
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            {isParsing ? (
              <motion.div
                key="parsing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col items-center justify-center space-y-8 text-center py-20"
              >
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
                    <FileText className="w-10 h-10 text-primary" />
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-background rounded-full p-1">
                    <Loader2 className="w-6 h-6 text-primary animate-spin" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold">Parsing Resume...</h2>
                  <p className="text-muted-foreground flex items-center justify-center gap-1">
                    Extracting skills and experience
                    <span className="flex space-x-1">
                      <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>.</motion.span>
                      <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }}>.</motion.span>
                      <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }}>.</motion.span>
                    </span>
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <div className="text-center space-y-2 mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-500 mb-4">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h2 className="text-3xl font-bold tracking-tight">Resume Analyzed</h2>
                  <p className="text-muted-foreground">Here's what we found. This will power your career matching.</p>
                </div>

                <div className="grid gap-6">
                  <Card className="bg-card/50 border-border">
                    <CardContent className="p-6">
                      <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Extracted Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {MOCK_RESUME_DATA.skills.map((skill, i) => (
                          <SkillChip key={skill} label={skill} variant="success" delay={i * 0.05} />
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-card/50 border-border">
                    <CardContent className="p-6">
                      <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Detected Interests & Domains</h3>
                      <div className="flex flex-wrap gap-2">
                        {MOCK_RESUME_DATA.interests.map((interest, i) => (
                          <SkillChip key={interest} label={interest} variant="neutral" delay={0.3 + (i * 0.05)} />
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-card/50 border-border">
                    <CardContent className="p-6">
                      <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Key Projects</h3>
                      <ul className="space-y-3">
                        {MOCK_RESUME_DATA.projects.map((project, i) => (
                          <motion.li 
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 + (i * 0.1) }}
                            className="flex items-start text-sm text-foreground/80 bg-secondary/30 p-3 rounded-md"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 mr-3 shrink-0" />
                            {project}
                          </motion.li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                <div className="flex justify-center pt-6">
                  <Button size="lg" onClick={handleContinue} className="px-8 rounded-full">
                    Looks good! Continue <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageTransition>
  );
}
