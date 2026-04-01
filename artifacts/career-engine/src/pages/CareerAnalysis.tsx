import React, { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { 
  ArrowLeft, BrainCircuit, Clock, BookOpen, AlertTriangle, 
  CheckCircle2, AlertCircle, PlayCircle, MapPin
} from "lucide-react";
import { PageTransition } from "@/components/PageTransition";
import { NavBar } from "@/components/NavBar";
import { SurvivalScore } from "@/components/SurvivalScore";
import { ProgressBar } from "@/components/ProgressBar";
import { SkillChip } from "@/components/SkillChip";
import { RoadmapTimeline } from "@/components/RoadmapTimeline";
import { MentorCard } from "@/components/MentorCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAppContext } from "@/lib/context";
import { getCareerById } from "@/data/careers";
import { getMentorsByCareer } from "@/data/mentors";
import { computeSurvivalScore, getStressFit, getWorkHoursFit, getLearningCurveFit, getSurvivalLabel, getRiskMessage } from "@/logic/survival";
import { computeSkillGap } from "@/logic/skillGap";
import { calculateMatchScore, computeSkillScore, computeInterestScore, computeGoalScore } from "@/logic/match";

export default function CareerAnalysis() {
  const [, setLocation] = useLocation();
  const { selectedCareer, skills, interests, careerGoal } = useAppContext();
  
  // Use selected career or fallback
  const career = selectedCareer || getCareerById("data-scientist");
  
  if (!career) {
    setLocation("/");
    return null;
  }

  // Calculate Match Scores
  const skillScore = computeSkillScore(skills, career.requiredSkills);
  const interestScore = computeInterestScore(interests, career.domain, career.keywords);
  const goalScore = computeGoalScore(careerGoal, career.goalKeywords);
  const matchScore = calculateMatchScore({ skillScore, interestScore, goalScore });

  // Calculate Survival Scores (using sensible defaults for missing user inputs)
  const stressFit = getStressFit(7, career.stressLevel); // assume user tolerance 7
  const workHoursFit = getWorkHoursFit(40, career.hoursPerWeek); // assume user wants 40h
  const learningCurveFit = getLearningCurveFit("moderate", career.learningCurve);
  const survivalScore = computeSurvivalScore({ stressFit, workHoursFit, learningCurveFit });
  const survivalInfo = getSurvivalLabel(survivalScore);
  const riskMessage = getRiskMessage(survivalScore, career.title);

  // Skill Gap Analysis
  const skillGap = computeSkillGap(skills, career.requiredSkills);
  
  // Mentors
  const mentors = getMentorsByCareer(career.id);

  return (
    <PageTransition>
      <NavBar />
      <div className="flex-1 flex w-full relative">
        {/* Sticky Mini Nav for Desktop */}
        <div className="hidden lg:block w-64 shrink-0 border-r border-border p-6 sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto">
          <Button variant="ghost" size="sm" onClick={() => setLocation("/recommendations")} className="mb-8 -ml-2 text-muted-foreground">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
          <div className="space-y-6">
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Analysis</p>
              <nav className="space-y-1">
                <a href="#overview" className="block px-3 py-2 text-sm rounded-md hover:bg-secondary text-foreground">Overview</a>
                <a href="#survival" className="block px-3 py-2 text-sm rounded-md hover:bg-secondary text-foreground">Survival Check</a>
                <a href="#skills" className="block px-3 py-2 text-sm rounded-md hover:bg-secondary text-foreground">Skill Gap</a>
                <a href="#day" className="block px-3 py-2 text-sm rounded-md hover:bg-secondary text-foreground">Day in the Life</a>
                <a href="#roadmap" className="block px-3 py-2 text-sm rounded-md hover:bg-secondary text-foreground">Roadmap</a>
                <a href="#mentors" className="block px-3 py-2 text-sm rounded-md hover:bg-secondary text-foreground">Mentors</a>
              </nav>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 w-full max-w-4xl p-4 md:p-8 lg:p-12 mx-auto space-y-16">
          
          {/* A. Career Overview */}
          <section id="overview" className="space-y-6">
            <div className="lg:hidden mb-6">
              <Button variant="ghost" size="sm" onClick={() => setLocation("/recommendations")} className="-ml-2 text-muted-foreground">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back
              </Button>
            </div>
            
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div>
                <h1 className="text-4xl font-bold tracking-tight text-foreground mb-2">{career.title}</h1>
                <div className="flex flex-wrap gap-3">
                  <Badge variant="secondary" className="bg-secondary/50 text-sm py-1 font-normal">
                    ${(career.salary.min / 1000).toFixed(0)}k - ${(career.salary.max / 1000).toFixed(0)}k
                  </Badge>
                  <Badge variant="secondary" className="bg-secondary/50 text-sm py-1 font-normal">
                    {career.demand} Demand
                  </Badge>
                  <Badge variant="outline" className="border-primary/30 text-primary text-sm py-1">
                    {matchScore}% Match
                  </Badge>
                </div>
              </div>
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {career.explanation}
            </p>
          </section>

          {/* D. Survival Analysis (Main Highlight) */}
          <section id="survival" className="scroll-mt-20">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <BrainCircuit className="w-6 h-6 mr-2 text-primary" />
              Reality Check & Survival
            </h2>
            <Card className="bg-card/50 border-border overflow-hidden relative">
              <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: survivalInfo.color === 'green' ? '#10B981' : survivalInfo.color === 'yellow' ? '#F59E0B' : '#EF4444' }} />
              <CardContent className="p-6 md:p-8">
                <div className="grid md:grid-cols-[1fr_2fr] gap-8 items-center">
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <SurvivalScore score={survivalScore} />
                    <Badge variant="outline" className={`px-3 py-1 font-semibold uppercase tracking-wider text-xs border-${survivalInfo.color}-500/30 text-${survivalInfo.color}-500`}>
                      {survivalInfo.label}
                    </Badge>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="bg-background/50 rounded-lg p-4 border border-border/50">
                      <p className="text-sm md:text-base text-foreground/90 font-medium">
                        "{riskMessage}"
                      </p>
                    </div>
                    
                    <div className="space-y-5">
                      <ProgressBar 
                        value={stressFit} 
                        label="Stress Compatibility" 
                        colorClass={stressFit >= 70 ? "bg-emerald-500" : stressFit >= 40 ? "bg-amber-500" : "bg-red-500"} 
                      />
                      <ProgressBar 
                        value={workHoursFit} 
                        label={`Work Hours Fit (${career.hoursPerWeek}h/wk)`} 
                        colorClass={workHoursFit >= 70 ? "bg-emerald-500" : workHoursFit >= 40 ? "bg-amber-500" : "bg-red-500"} 
                      />
                      <ProgressBar 
                        value={learningCurveFit} 
                        label={`Learning Curve (${career.learningCurve})`} 
                        colorClass={learningCurveFit >= 70 ? "bg-emerald-500" : learningCurveFit >= 40 ? "bg-amber-500" : "bg-red-500"} 
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* E. Skill Gap Analysis */}
          <section id="skills" className="scroll-mt-20">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <AlertTriangle className="w-6 h-6 mr-2 text-primary" />
              Skill Gap Analysis
            </h2>
            <Card className="bg-card/50 border-border">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-medium flex justify-between items-center">
                  Readiness Score
                  <span className="text-2xl font-bold text-primary">{skillGap.completionPercent}%</span>
                </CardTitle>
                <ProgressBar value={skillGap.completionPercent} colorClass="bg-primary" />
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid md:grid-cols-2 gap-8 mt-6">
                  <div>
                    <h3 className="flex items-center text-sm font-semibold text-emerald-500 uppercase tracking-wider mb-4">
                      <CheckCircle2 className="w-4 h-4 mr-2" /> Skills You Have
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {skillGap.have.length > 0 ? (
                        skillGap.have.map((s, i) => <SkillChip key={i} label={s} variant="success" />)
                      ) : (
                        <p className="text-sm text-muted-foreground italic">None of the core skills matched.</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="flex items-center text-sm font-semibold text-red-500 uppercase tracking-wider mb-4">
                      <AlertCircle className="w-4 h-4 mr-2" /> Missing Skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {skillGap.missing.length > 0 ? (
                        skillGap.missing.map((s, i) => <SkillChip key={i} label={s} variant="danger" />)
                      ) : (
                        <p className="text-sm text-muted-foreground italic">You have all the core skills!</p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* B. Day in Life */}
          <section id="day" className="scroll-mt-20">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <Clock className="w-6 h-6 mr-2 text-primary" />
              A Typical Day
            </h2>
            <Card className="bg-card/50 border-border">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {career.dayInLife.map((item, i) => {
                    const [time, desc] = item.split(" — ");
                    return (
                      <div key={i} className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-6 pb-4 border-b border-border/50 last:border-0 last:pb-0">
                        <span className="text-sm font-semibold text-primary w-24 shrink-0 mt-0.5">{time}</span>
                        <span className="text-foreground/90">{desc}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </section>

          {/* C. Challenges */}
          <section id="challenges" className="scroll-mt-20">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <AlertTriangle className="w-6 h-6 mr-2 text-amber-500" />
              The Hard Parts
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {career.challenges.map((challenge, i) => (
                <div key={i} className="bg-secondary/40 border border-border p-4 rounded-xl flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-foreground/90">{challenge}</p>
                </div>
              ))}
            </div>
          </section>

          {/* F. Roadmap */}
          <section id="roadmap" className="scroll-mt-20">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <MapPin className="w-6 h-6 mr-2 text-primary" />
              12-Month Roadmap
            </h2>
            <div className="bg-card/30 border border-border rounded-xl p-6 md:p-8">
              <RoadmapTimeline steps={career.roadmap} />
            </div>
          </section>

          {/* G. Mentor Connect */}
          <section id="mentors" className="scroll-mt-20 pb-20">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <BookOpen className="w-6 h-6 mr-2 text-primary" />
              Talk to Someone Who Did It
            </h2>
            <div className="grid gap-6">
              {mentors.length > 0 ? (
                mentors.map(mentor => <MentorCard key={mentor.id} mentor={mentor} />)
              ) : (
                <div className="text-center p-8 bg-secondary/30 rounded-xl border border-border">
                  <p className="text-muted-foreground">No mentors available for this track right now.</p>
                </div>
              )}
            </div>
          </section>

        </main>
      </div>
    </PageTransition>
  );
}
