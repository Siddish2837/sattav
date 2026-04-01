import React, { useState } from "react";
import { useLocation } from "wouter";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageTransition } from "@/components/PageTransition";
import { NavBar } from "@/components/NavBar";
import { useAppContext } from "@/lib/context";

export default function FresherInput() {
  const [, setLocation] = useLocation();
  const { interests, careerGoal, setInterests, setCareerGoal } = useAppContext();
  const [localInterests, setLocalInterests] = useState(interests);
  const [localGoal, setLocalGoal] = useState(careerGoal);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!localInterests.trim() || !localGoal.trim()) return;
    
    setInterests(localInterests);
    setCareerGoal(localGoal);
    setLocation("/processing");
  };

  return (
    <PageTransition>
      <NavBar />
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-2xl mx-auto">
          <div className="text-center space-y-2 mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 text-primary mb-4">
              <Sparkles className="w-8 h-8" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Tell us about yourself</h1>
            <p className="text-muted-foreground text-lg">
              We'll use this to find careers that match your natural inclinations.
            </p>
          </div>

          <Card className="bg-card/50 border-border shadow-xl">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-3">
                  <Label htmlFor="interests" className="text-base font-semibold">What are you passionate about?</Label>
                  <p className="text-sm text-muted-foreground">List topics, hobbies, or subjects you enjoy (e.g., problem solving, art, data, helping people).</p>
                  <Input
                    id="interests"
                    value={localInterests}
                    onChange={(e) => setLocalInterests(e.target.value)}
                    placeholder="E.g., Technology, writing, analyzing data..."
                    className="bg-background/50 h-12 text-base"
                    autoFocus
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="goal" className="text-base font-semibold">Describe your ideal career in a few sentences</Label>
                  <p className="text-sm text-muted-foreground">What kind of impact do you want to make? Do you prefer building, leading, analyzing, or creating?</p>
                  <Textarea
                    id="goal"
                    value={localGoal}
                    onChange={(e) => setLocalGoal(e.target.value)}
                    placeholder="I want to build products that people use every day, working in a fast-paced environment..."
                    className="bg-background/50 min-h-[120px] text-base resize-none"
                  />
                </div>

                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full h-14 text-lg rounded-xl"
                  disabled={!localInterests.trim() || !localGoal.trim()}
                >
                  Analyze My Profile <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageTransition>
  );
}
