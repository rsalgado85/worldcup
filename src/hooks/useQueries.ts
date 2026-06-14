import { useQuery } from '@tanstack/react-query';
import { fetchTeams, fetchMatches, fetchGroups, fetchStadiums, fetchPlayers } from '@/services/api';

export function useTeams() {
  return useQuery({ queryKey: ['teams'], queryFn: fetchTeams, staleTime: 60_000 });
}

export function useMatches() {
  return useQuery({ queryKey: ['matches'], queryFn: fetchMatches, staleTime: 30_000, refetchInterval: 60_000 });
}

export function useGroups() {
  return useQuery({ queryKey: ['groups'], queryFn: fetchGroups, staleTime: 60_000 });
}

export function useStadiums() {
  return useQuery({ queryKey: ['stadiums'], queryFn: fetchStadiums, staleTime: 300_000 });
}

export function usePlayers(teamId?: number) {
  return useQuery({
    queryKey: ['players', teamId],
    queryFn: () => fetchPlayers(teamId),
    staleTime: 300_000,
    enabled: !!teamId,
  });
}
