import React from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { UploadCloud, GraduationCap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { PageTransition } from "@/components/PageTransition";
import { NavBar } from "@/components/NavBar";
import { useAppContext } from "@/lib/context";

export default function EntrySelection() {
  const [, setLocation] = useLocation();
  const { setUserType } = useAppContext();

  const handleSelect = (type: "resume" | "fresher") => {
    setUserType(type);
    setLocation(type === "resume" ? "/resume" : "/fresher");
  };

  return (
    <PageTransition>
      <NavBar />
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-4xl mx-auto space-y-8">
          <div className="space-y-2 text-center mb-12">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight">How should we start?</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose your starting point. We'll tailor the analysis based on where you are in your journey.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-3xl mx-auto">
            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <Card 
                className="h-full cursor-pointer bg-card hover:bg-secondary/40 border-border transition-colors duration-300"
                onClick={() => handleSelect("resume")}
                data-testid="card-entry-resume"
              >
                <CardContent className="flex flex-col items-center text-center p-10 space-y-6">
                  <div className="w-20 h-20 rounded-2xl bg-primary/20 flex items-center justify-center text-primary">
                    <UploadCloud className="w-10 h-10" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-semibold">Upload Resume</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Parse your existing experience, skills, and projects to find the perfect next step.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <Card 
                className="h-full cursor-pointer bg-card hover:bg-secondary/40 border-border transition-colors duration-300"
                onClick={() => handleSelect("fresher")}
                data-testid="card-entry-fresher"
              >
                <CardContent className="flex flex-col items-center text-center p-10 space-y-6">
                  <div className="w-20 h-20 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                    <GraduationCap className="w-10 h-10" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-semibold">I'm a Fresher</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Start from scratch. Tell us your interests and we'll build a roadmap from day one.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
