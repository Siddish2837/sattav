import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { User, Star, Briefcase, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface MentorProps {
  mentor: {
    id: string;
    name: string;
    role: string;
    company: string;
    experience: string;
    avatar: string;
    rating: number;
    sessionsCompleted: number;
    bio: string;
    availability: string;
  };
}

export function MentorCard({ mentor }: MentorProps) {
  const { toast } = useToast();

  const handleRequest = () => {
    toast({
      title: "Request Sent!",
      description: `Your mentorship request to ${mentor.name} has been sent.`,
    });
  };

  return (
    <Card className="bg-card/40 border-border overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-lg shrink-0">
            {mentor.avatar}
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-lg text-foreground">{mentor.name}</h4>
            <p className="text-sm text-muted-foreground">{mentor.role} @ {mentor.company}</p>
            
            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Briefcase className="w-3 h-3" />
                {mentor.experience}
              </div>
              <div className="flex items-center gap-1 text-amber-400">
                <Star className="w-3 h-3 fill-current" />
                {mentor.rating} ({mentor.sessionsCompleted} sessions)
              </div>
            </div>
            
            <p className="text-sm mt-3 leading-relaxed text-foreground/80 line-clamp-2">
              {mentor.bio}
            </p>
            
            <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Avail: {mentor.availability}</span>
              <Button size="sm" onClick={handleRequest} className="bg-primary/20 text-primary hover:bg-primary hover:text-primary-foreground transition-colors">
                Request Mentorship
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
