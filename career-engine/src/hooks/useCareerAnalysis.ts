import { useQuery } from '@tanstack/react-query';
import { analyzeCareer } from '@/lib/api';
import { useAppContext } from '@/lib/context';

export function useCareerAnalysis(careerId?: string) {
  const { skills, interests, careerGoal, selectedCareer } = useAppContext();
  
  const targetId = careerId ?? selectedCareer?.id;

  return useQuery({
    queryKey: ['career-analysis', targetId, skills, interests, careerGoal],
    queryFn: () => analyzeCareer({ careerId: targetId!, skills, interests, careerGoal }),
    enabled: !!targetId,
    staleTime: 1000 * 60 * 5, 
    retry: 1,
  });
}
