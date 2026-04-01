import React from "react";
import { Link, useLocation } from "wouter";
import { Compass, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/lib/context";

const BACK_MAP: Record<string, string> = {
  "/entry": "/",
  "/resume": "/entry",
  "/fresher": "/entry",
  "/processing": "/entry",
  "/recommendations": "/entry",
  "/analysis": "/recommendations",
};

export function NavBar() {
  const [location, setLocation] = useLocation();
  const { resetState } = useAppContext();

  const backPath = BACK_MAP[location];

  const handleBack = () => {
    if (backPath) {
      setLocation(backPath);
    }
  };

  const handleStartOver = () => {
    resetState();
    setLocation("/entry");
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-2">
          {backPath && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              className="mr-1 text-muted-foreground hover:text-foreground"
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <Link href="/" className="flex items-center gap-2" onClick={resetState}>
            <Compass className="h-6 w-6 text-primary" />
            <span className="font-semibold text-lg tracking-tight">AI Career Engine</span>
          </Link>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleStartOver}
          className="hidden sm:flex border-primary/20 hover:bg-primary/10"
        >
          New Analysis
        </Button>
      </div>
    </nav>
  );
}
