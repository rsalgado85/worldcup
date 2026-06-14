import type { Team, Match, Group, Stadium, WCResponse, ApiFootballResponse, Player } from '@/types';

const WC_BASE = 'https://worldcup26.ir';
const APIF_BASE = 'https://v3.football.api-sports.io';
const APIF_KEY = import.meta.env.VITE_APIFOOTBALL_KEY || '';

// ─── WorldCup26.ir (FREE, no key) ───

export async function fetchTeams(): Promise<Team[]> {
  const res = await fetch(`${WC_BASE}/get/teams`);
  const data: WCResponse<Team> = await res.json();
  return data.teams;
}

export async function fetchMatches(): Promise<Match[]> {
  const res = await fetch(`${WC_BASE}/get/games`);
  const data: WCResponse<Match> = await res.json();
  return data.games;
}

export async function fetchGroups(): Promise<Group[]> {
  const res = await fetch(`${WC_BASE}/get/groups`);
  const data: WCResponse<Group> = await res.json();
  return data.groups;
}

export async function fetchStadiums(): Promise<Stadium[]> {
  const res = await fetch(`${WC_BASE}/get/stadiums`);
  const data: WCResponse<Stadium> = await res.json();
  return data.stadiums;
}

// ─── API-Football (FREE tier, needs key) ───

async function apif<T>(endpoint: string, params?: Record<string, string | number>): Promise<T> {
  if (!APIF_KEY) throw new Error('API-Football key not configured');
  const url = new URL(`${APIF_BASE}/${endpoint}`);
  if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)));
  const res = await fetch(url.toString(), {
    headers: { 'x-apisports-key': APIF_KEY },
  });
  if (!res.ok) throw new Error(`API-Football error: ${res.status}`);
  return res.json();
}

export async function fetchPlayers(teamId?: number): Promise<Player[]> {
  const params: Record<string, string | number> = { league: 1, season: 2026 };
  if (teamId) params.team = teamId;
  const data = await apif<ApiFootballResponse<Player>>('players', params);
  return data.response;
}

export async function fetchPlayerStats(fixtureId: number): Promise<unknown> {
  const data = await apif<ApiFootballResponse<unknown>>('fixtures/players', { fixture: fixtureId });
  return data.response;
}

export async function fetchTeamStats(teamId: number): Promise<unknown> {
  const data = await apif<ApiFootballResponse<unknown>>('teams/statistics', {
    league: 1,
    season: 2026,
    team: teamId,
  });
  return data.response;
}

// ─── OpenFootball (backup, static JSON from GitHub) ───

const OF_BASE = 'https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026';

export async function fetchOpenFootballMatches() {
  const res = await fetch(`${OF_BASE}/worldcup.json`);
  return res.json();
}
