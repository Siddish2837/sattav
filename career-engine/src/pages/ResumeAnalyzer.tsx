import React, { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Loader2, Upload } from "lucide-react";
import { PageTransition } from "@/components/PageTransition";
import { NavBar } from "@/components/NavBar";
import { useAppContext } from "@/lib/context";

export default function ResumeAnalyzer() {
  const [, setLocation] = useLocation();
  const { setSkills, setInterests, setRecommendations } = useAppContext();
  const [isParsing, setIsParsing] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsParsing(true);

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${apiUrl}/upload-resume`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        setSkills(data.skills || []);
        setInterests("Technology"); 
        
        if (data.recommendations) {
          setRecommendations(data.recommendations);
        }
        
        // Redirect directly to recommendations page
        setLocation("/recommendations");
      } else {
        alert(data.error?.message || data.error || data.message || "Failed to parse pdf");
      }
    } catch (err: any) {
      alert("Error connecting to server: " + err.message);
    } finally {
      setIsParsing(false);
    }
  };

  return (
    <PageTransition>
      <NavBar />
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            {!isParsing ? (
              <motion.div
                key="upload"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col items-center justify-center space-y-8 text-center py-20"
              >
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                  <Upload className="w-10 h-10 text-primary" />
                </div>
                <div className="space-y-4">
                  <h2 className="text-3xl font-bold tracking-tight">Upload Your Resume</h2>
                  <p className="text-muted-foreground text-lg max-w-md mx-auto">
                    We'll extract your skills and instantly calculate your career match. PDF format only.
                  </p>
                  
                  <div className="pt-8">
                    <label className="cursor-pointer inline-flex items-center justify-center h-12 px-8 rounded-full shadow-lg shadow-primary/20 bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors">
                      <input 
                        type="file" 
                        accept=".pdf" 
                        className="hidden" 
                        onChange={handleFileUpload}
                      />
                      Select PDF File
                    </label>
                  </div>
                </div>
              </motion.div>
            ) : (
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
                  <h2 className="text-2xl font-semibold">Parsing Resume & Calculating Path...</h2>
                  <p className="text-muted-foreground">Uploading directly to the engine...</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageTransition>
  );
}
