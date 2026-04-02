import React, { createContext, useContext, useState, ReactNode } from "react";

export type Career = {
  id: string;
  title: string;
  domain: string;
  keywords: string[];
  goalKeywords: string[];
  salary: { min: number; max: number; currency: string };
  demand: string;
  stressLevel: number;
  hoursPerWeek: number;
  learningCurve: string;
  requiredSkills: string[];
  skillPriority: Record<string, number>;
  dayInLife: string[];
  challenges: string[];
  roadmap: Array<{ month: string; step: string }>;
  mentors: Array<{ name: string; role: string; experience: string; avatar: string }>;
  type: string;
  explanation: string;
};

export type RecommendationInfo = {
  career: Career;
  score: number;
  reason?: string;
  missingSkills?: string[];
  matchedSkills?: string[];
};

export type Recommendations = {
  safe: RecommendationInfo | null;
  balanced: RecommendationInfo | null;
  dream: RecommendationInfo | null;
};

interface AppState {
  userType: "fresher" | "resume" | null;
  skills: string[];
  interests: string;
  careerGoal: string;
  selectedCareer: Career | null;
  recommendations: Recommendations;
  setUserType: (type: "fresher" | "resume" | null) => void;
  setSkills: (skills: string[]) => void;
  setInterests: (interests: string) => void;
  setCareerGoal: (goal: string) => void;
  setSelectedCareer: (career: Career | null) => void;
  setRecommendations: (recs: Recommendations) => void;
  resetState: () => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [userType, setUserType] = useState<"fresher" | "resume" | null>(null);
  const [skills, setSkills] = useState<string[]>([]);
  const [interests, setInterests] = useState("");
  const [careerGoal, setCareerGoal] = useState("");
  const [selectedCareer, setSelectedCareer] = useState<Career | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendations>({ safe: null, balanced: null, dream: null });

  const resetState = () => {
    setUserType(null);
    setSkills([]);
    setInterests("");
    setCareerGoal("");
    setSelectedCareer(null);
    setRecommendations({ safe: null, balanced: null, dream: null });
  };

  return (
    <AppContext.Provider
      value={{
        userType,
        skills,
        interests,
        careerGoal,
        selectedCareer,
        recommendations,
        setUserType,
        setSkills,
        setInterests,
        setCareerGoal,
        setSelectedCareer,
        setRecommendations,
        resetState,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}
