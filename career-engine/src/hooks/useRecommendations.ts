import { useQuery } from '@tanstack/react-query';
import { getRecommendations } from '@/lib/api';
import { useAppContext } from '@/lib/context';

export function useRecommendations() {
  const { skills, interests, careerGoal } = useAppContext();

  // Extract non-empty state
  const hasInputs = skills.length > 0 || interests.trim().length > 0 || careerGoal.trim().length > 0;

  return useQuery({
    queryKey: ['recommendations', skills, interests, careerGoal],
    queryFn: () => getRecommendations({ skills, interests, careerGoal }),
    enabled: hasInputs,       // Only fetch if they have typed something
    staleTime: 1000 * 60 * 5, // Cache for 5 mins locally so re-navigating is instant
    retry: 1,                 // Don't spam retries on 400 validation errors
  });
}
