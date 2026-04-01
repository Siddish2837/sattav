import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AnimatePresence } from "framer-motion";
import { AppProvider } from "@/lib/context";

import NotFound from "@/pages/not-found";
import Landing from "@/pages/Landing";
import EntrySelection from "@/pages/EntrySelection";
import ResumeAnalyzer from "@/pages/ResumeAnalyzer";
import FresherInput from "@/pages/FresherInput";
import Processing from "@/pages/Processing";
import Recommendations from "@/pages/Recommendations";
import CareerAnalysis from "@/pages/CareerAnalysis";

const queryClient = new QueryClient();

function Router() {
  return (
    <AnimatePresence mode="wait">
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
