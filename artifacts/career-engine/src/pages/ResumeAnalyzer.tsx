import React, { useState, useRef } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  UploadCloud, FileText, Loader2, CheckCircle2,
  ArrowRight, AlertCircle, X, RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SkillChip } from "@/components/SkillChip";
import { PageTransition } from "@/components/PageTransition";
import { NavBar } from "@/components/NavBar";
import { useAppContext } from "@/lib/context";
import type { ParsedResumeData } from "@/lib/context";

type UploadPhase = "idle" | "uploading" | "success" | "error";

const ACCEPTED_TYPES = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/msword"];
const ACCEPTED_EXT = [".pdf", ".docx"];

export default function ResumeAnalyzer() {
  const [, setLocation] = useLocation();
  const { setSkills, setInterests, setResumeData } = useAppContext();

  const [phase, setPhase] = useState<UploadPhase>("idle");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [parsed, setParsed] = useState<ParsedResumeData | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    if (!ACCEPTED_TYPES.includes(file.type) && !ACCEPTED_EXT.some(ext => file.name.toLowerCase().endsWith(ext))) {
      return "Only PDF and DOCX files are supported.";
    }
    if (file.size > 5 * 1024 * 1024) {
      return "File size must be under 5 MB.";
    }
    return null;
  };

  const handleFilePick = (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    setSelectedFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFilePick(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFilePick(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a file first.");
      return;
    }

    setPhase("uploading");
    setError(null);

    const formData = new FormData();
    formData.append("resume", selectedFile);

    try {
      const res = await fetch("/api/upload-resume", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Upload failed. Please try again.");
      }

      const resumeParsed: ParsedResumeData = {
        skills: data.skills || [],
        education: data.education || [],
        experience: data.experience || [],
        summary: data.summary || "",
        filename: data.filename || selectedFile.name,
      };

      setParsed(resumeParsed);
      setResumeData(resumeParsed);
      setSkills(resumeParsed.skills);
      setInterests(resumeParsed.experience.join(", "));
      setPhase("success");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(msg);
      setPhase("error");
    }
  };

  const handleRetry = () => {
    setPhase("idle");
    setSelectedFile(null);
    setParsed(null);
    setError(null);
  };

  const handleContinue = () => {
    setLocation("/processing");
  };

  return (
    <PageTransition>
      <NavBar />
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-3xl mx-auto">
          <AnimatePresence mode="wait">

            {/* ── Phase: Idle — file picker ── */}
            {(phase === "idle" || phase === "error") && (
              <motion.div
                key="upload"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="text-center space-y-2 mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 text-primary mb-4">
                    <UploadCloud className="w-8 h-8" />
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Upload Your Resume</h1>
                  <p className="text-muted-foreground text-lg">
                    We'll extract your skills and experience to find your best career matches.
                  </p>
                </div>

                {/* Drop zone */}
                <div
                  className={`relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-200 ${
                    dragActive
                      ? "border-primary bg-primary/10"
                      : selectedFile
                      ? "border-emerald-500/60 bg-emerald-500/5"
                      : "border-border hover:border-primary/50 hover:bg-secondary/30"
                  }`}
                  onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={handleDrop}
                  onClick={() => inputRef.current?.click()}
                >
                  <input
                    ref={inputRef}
                    type="file"
                    accept=".pdf,.docx"
                    className="hidden"
                    onChange={handleInputChange}
                  />

                  {selectedFile ? (
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-14 h-14 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                        <FileText className="w-7 h-7" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{selectedFile.name}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {(selectedFile.size / 1024).toFixed(0)} KB · Click to change
                        </p>
                      </div>
                      <button
                        className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
                        onClick={(e) => { e.stopPropagation(); handleRetry(); }}
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-3">
                      <UploadCloud className="w-12 h-12 text-muted-foreground" />
                      <div>
                        <p className="text-lg font-medium">Drop your resume here</p>
                        <p className="text-sm text-muted-foreground mt-1">or click to browse — PDF or DOCX, max 5 MB</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Error banner */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      className="flex items-start gap-3 bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400"
                    >
                      <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                      <p className="text-sm">{error}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <Button
                  size="lg"
                  className="w-full h-14 text-base rounded-xl"
                  disabled={!selectedFile}
                  onClick={handleUpload}
                >
                  Analyze Resume <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </motion.div>
            )}

            {/* ── Phase: Uploading ── */}
            {phase === "uploading" && (
              <motion.div
                key="uploading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col items-center justify-center space-y-8 text-center py-20"
              >
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                    <FileText className="w-10 h-10 text-primary" />
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-background rounded-full p-1">
                    <Loader2 className="w-6 h-6 text-primary animate-spin" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold">Parsing Resume</h2>
                  <p className="text-muted-foreground flex items-center justify-center gap-1">
                    Extracting skills, education, and experience
                    <span className="flex space-x-1 ml-1">
                      {[0, 0.2, 0.4].map((delay, i) => (
                        <motion.span
                          key={i}
                          animate={{ opacity: [0, 1, 0] }}
                          transition={{ repeat: Infinity, duration: 1.5, delay }}
                        >.</motion.span>
                      ))}
                    </span>
                  </p>
                </div>

                {/* Animated progress bar */}
                <div className="w-64 h-1.5 bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-primary rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: "90%" }}
                    transition={{ duration: 3, ease: "easeInOut" }}
                  />
                </div>
              </motion.div>
            )}

            {/* ── Phase: Success — show extracted data ── */}
            {phase === "success" && parsed && (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="text-center space-y-2">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mb-3">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h2 className="text-3xl font-bold tracking-tight">Resume Analyzed</h2>
                  <p className="text-muted-foreground">
                    Found {parsed.skills.length} skills from <span className="text-foreground font-medium">{parsed.filename}</span>.
                    This will power your career matching.
                  </p>
                </div>

                <div className="grid gap-4">
                  {/* Skills */}
                  <Card className="bg-card/50 border-border">
                    <CardContent className="p-6">
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                        Extracted Skills ({parsed.skills.length})
                      </h3>
                      {parsed.skills.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {parsed.skills.map((skill, i) => (
                            <SkillChip key={skill} label={skill} variant="success" delay={i * 0.04} />
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground italic">No recognized skills found. You can continue and results will be based on experience.</p>
                      )}
                    </CardContent>
                  </Card>

                  {/* Education */}
                  {parsed.education.length > 0 && (
                    <Card className="bg-card/50 border-border">
                      <CardContent className="p-6">
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Education</h3>
                        <ul className="space-y-2">
                          {parsed.education.map((line, i) => (
                            <motion.li
                              key={i}
                              initial={{ opacity: 0, x: -12 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.3 + i * 0.08 }}
                              className="flex items-start text-sm text-foreground/80 bg-secondary/30 p-3 rounded-lg"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 mr-3 shrink-0" />
                              {line}
                            </motion.li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}

                  {/* Experience */}
                  {parsed.experience.length > 0 && (
                    <Card className="bg-card/50 border-border">
                      <CardContent className="p-6">
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Experience Signals</h3>
                        <ul className="space-y-2">
                          {parsed.experience.map((line, i) => (
                            <motion.li
                              key={i}
                              initial={{ opacity: 0, x: -12 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.5 + i * 0.08 }}
                              className="flex items-start text-sm text-foreground/80 bg-secondary/30 p-3 rounded-lg"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 mr-3 shrink-0" />
                              {line}
                            </motion.li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Button variant="outline" onClick={handleRetry} className="gap-2 border-border">
                    <RefreshCw className="w-4 h-4" /> Upload Different File
                  </Button>
                  <Button size="lg" onClick={handleContinue} className="flex-1 rounded-xl gap-2">
                    Continue to Matching <ArrowRight className="w-5 h-5" />
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
