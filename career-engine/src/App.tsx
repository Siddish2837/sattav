import { Suspense, lazy } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AnimatePresence } from "framer-motion";
import { AppProvider } from "@/lib/context";

// Lazy load heavy pages for code splitting
const NotFound = lazy(() => import("@/pages/not-found"));
const Landing = lazy(() => import("@/pages/Landing"));
const EntrySelection = lazy(() => import("@/pages/EntrySelection"));
const ResumeAnalyzer = lazy(() => import("@/pages/ResumeAnalyzer"));
const FresherInput = lazy(() => import("@/pages/FresherInput"));
const Processing = lazy(() => import("@/pages/Processing"));
const Recommendations = lazy(() => import("@/pages/Recommendations"));
const CareerAnalysis = lazy(() => import("@/pages/CareerAnalysis"));

const queryClient = new QueryClient();

// Minimal fallback spinner
const PageSpinner = () => (
  <div className="flex-1 flex items-center justify-center min-h-screen bg-background">
    <div className="w-8 h-8 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
  </div>
);

function Router() {
  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<PageSpinner />}>
        <Switch>
          <Route path="/" component={Landing} />
          <Route path="/entry" component={EntrySelection} />
          <Route path="/resume" component={ResumeAnalyzer} />
          <Route path="/fresher" component={FresherInput} />
          <Route path="/processing" component={Processing} />
          <Route path="/recommendations" component={Recommendations} />
          <Route path="/analysis" component={CareerAnalysis} />
          <Route component={NotFound} />
        </Switch>
      </Suspense>
    </AnimatePresence>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
        </AppProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
