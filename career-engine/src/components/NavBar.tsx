import React from "react";
import { Link } from "wouter";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/lib/context";

export function NavBar() {
  const { resetState } = useAppContext();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 card-glass">
      <div className="container mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2" onClick={resetState}>
          <Compass className="h-6 w-6 text-primary drop-shadow-[0_0_8px_hsl(38,95%,55%,0.5)]" />
          <span className="font-semibold text-lg tracking-tight">AI Career Engine</span>
        </Link>
        <Link href="/" onClick={resetState} className="flex items-center">
          <Button variant="outline" size="sm" className="hidden sm:flex border-primary/20 hover:bg-primary/10">
            New Analysis
          </Button>
        </Link>
      </div>
    </nav>
  );
}
