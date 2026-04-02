import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Loader2, Upload, AlertCircle, RefreshCw } from "lucide-react";
import { PageTransition } from "@/components/PageTransition";
import { NavBar } from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/lib/context";
import { parseResume, getRecommendations, ApiError } from "@/lib/api";

type LoadingState = "idle" | "warming" | "uploading" | "parsing" | "recommending" | "error";

export default function ResumeAnalyzer() {
  const [, setLocation] = useLocation();
  const { setSkills, setInterests, setRecommendations } = useAppContext();
  const [loadingState, setLoadingState] = useState<LoadingState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [retryFile, setRetryFile] = useState<File | null>(null);

  // Cold-start mitigation: Ping the backend on mount to wake it up
  useEffect(() => {
    const wakeUp = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        await fetch(`${apiUrl}/health`);
      } catch (err) {
        console.warn("Warm-up ping failed, server might be starting or unreachable.");
      }
    };
    wakeUp();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement> | File) => {
    const file = e instanceof File ? e : e.target.files?.[0];
    if (!file) return;

    setLoadingState("uploading");
    setErrorMessage(null);
    setRetryFile(file);

    try {
      // STEP 1: Parse Resume (Extract Skills)
      setLoadingState("parsing");
      const parseData = await parseResume(file);
      
      setSkills(parseData.skills);
      setInterests("Technology"); // Default interest for resume flow

      // Redirect to results - The recommendations page will fetch results based on the new skills
      setLocation("/recommendations");
    } catch (err: any) {
      setLoadingState("error");
      if (err instanceof ApiError) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("A network error occurred. Please check your connection.");
      }
    }
  };

  const getLoadingMessage = () => {
    switch (loadingState) {
      case "uploading": return "Uploading file...";
      case "parsing": return "Deep scanning resume text...";
      case "recommending": return "Finding your best career matches...";
      default: return "Processing...";
    }
  };

  return (
    <PageTransition>
      <NavBar />
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-3xl mx-auto text-center">
          <AnimatePresence mode="wait">
            {loadingState === "idle" && (
              <motion.div
                key="idle"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col items-center py-20 space-y-8"
              >
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Upload className="w-10 h-10" />
                </div>
                <div className="space-y-4">
                  <h1 className="text-4xl font-bold tracking-tight">Smart Resume Analysis</h1>
                  <p className="text-muted-foreground text-lg max-w-md mx-auto">
                    Upload your resume (PDF, max 2MB) to instantly extract skills and discover your top career paths.
                  </p>
                  
                  <div className="pt-8">
                    <label className="cursor-pointer inline-flex items-center justify-center h-14 px-10 rounded-full shadow-xl shadow-primary/20 bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all active:scale-95">
                      <input 
                        type="file" 
                        accept=".pdf" 
                        className="hidden" 
                        onChange={handleFileUpload}
                      />
                      Select PDF Resume
                    </label>
                  </div>
                </div>
              </motion.div>
            )}

            {loadingState !== "idle" && loadingState !== "error" && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center py-24 space-y-8"
              >
                <div className="relative">
                  <div className="w-32 h-32 rounded-full border-4 border-primary/10 border-t-primary animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <FileText className="w-10 h-10 text-primary animate-pulse" />
                  </div>
                </div>
                <div className="space-y-3">
                  <h2 className="text-2xl font-bold">{getLoadingMessage()}</h2>
                  <p className="text-muted-foreground animate-pulse">This usually takes less than 10 seconds</p>
                </div>
              </motion.div>
            )}

            {loadingState === "error" && (
              <motion.div
                key="error"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center py-20 space-y-8"
              >
                <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
                  <AlertCircle className="w-10 h-10" />
                </div>
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold">Analysis Failed</h2>
                  <p className="text-muted-foreground bg-destructive/5 p-4 rounded-xl border border-destructive/10 max-w-md mx-auto">
                    {errorMessage || "An unexpected error occurred during parsing."}
                  </p>
                  
                  <div className="flex gap-4 justify-center pt-6">
                    <Button 
                      variant="outline" 
                      onClick={() => setLoadingState("idle")}
                      className="rounded-full px-8"
                    >
                      Back
                    </Button>
                    {retryFile && (
                      <Button 
                        onClick={() => handleFileUpload(retryFile)}
                        className="rounded-full px-8 gap-2"
                      >
                        <RefreshCw className="w-4 h-4" /> Try Again
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageTransition>
  );
}
