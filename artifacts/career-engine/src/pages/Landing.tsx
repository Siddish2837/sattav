import React from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Compass, Target, TrendingUp, BarChart, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageTransition } from "@/components/PageTransition";
import { NavBar } from "@/components/NavBar";

export default function Landing() {
  return (
    <PageTransition>
      <NavBar />
      <main className="flex-1 flex flex-col">
        {/* Hero Section */}
        <section className="w-full py-24 md:py-32 lg:py-48 flex-1 flex flex-col justify-center relative overflow-hidden">
          {/* Abstract background elements */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] pointer-events-none -z-10 opacity-50" />
          <div className="absolute top-1/4 -right-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none -z-10" />
          
          <div className="container px-4 md:px-6 max-w-5xl mx-auto flex flex-col items-center text-center space-y-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm font-medium text-primary backdrop-blur-sm"
            >
              <Compass className="mr-2 h-4 w-4" />
              AI-Powered Career Intelligence
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground max-w-4xl"
            >
              Discover Your Career Path with <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-400">Brutal Honesty.</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mx-auto max-w-[700px] text-lg md:text-xl text-muted-foreground leading-relaxed"
            >
              Stop guessing. We analyze your skills, interests, and stress tolerance against real-world career data to find paths where you'll actually survive and thrive.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="w-full flex justify-center"
            >
              <Link href="/entry">
                <Button size="lg" className="h-14 px-8 text-lg font-semibold rounded-full shadow-lg shadow-primary/20 group">
                  Start Your Analysis <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="pt-12 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl border-t border-border/50"
            >
              <div className="flex flex-col items-center space-y-2">
                <Target className="h-8 w-8 text-primary mb-2" />
                <h3 className="font-semibold text-lg">Career Matching</h3>
                <p className="text-sm text-muted-foreground text-center">Score-based alignment with your goals</p>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <BarChart className="h-8 w-8 text-emerald-500 mb-2" />
                <h3 className="font-semibold text-lg">Survival Analysis</h3>
                <p className="text-sm text-muted-foreground text-center">Stress & work-hour compatibility check</p>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <TrendingUp className="h-8 w-8 text-amber-500 mb-2" />
                <h3 className="font-semibold text-lg">Skill Gap Reality</h3>
                <p className="text-sm text-muted-foreground text-center">Exact roadmap to learn what you're missing</p>
              </div>
            </motion.div>
          </div>
        </section>
        
        {/* Stats Row */}
        <section className="w-full py-12 bg-secondary/30 border-y border-border/50">
          <div className="container px-4 md:px-6 max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-border/50">
              <div className="flex flex-col space-y-1">
                <span className="text-3xl font-bold text-foreground">6</span>
                <span className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">Career Tracks</span>
              </div>
              <div className="flex flex-col space-y-1">
                <span className="text-3xl font-bold text-foreground">10+</span>
                <span className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">Industries</span>
              </div>
              <div className="flex flex-col space-y-1">
                <span className="text-3xl font-bold text-foreground">100%</span>
                <span className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">Data Backed</span>
              </div>
              <div className="flex flex-col space-y-1">
                <span className="text-3xl font-bold text-foreground">Real</span>
                <span className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">Simulations</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </PageTransition>
  );
}
