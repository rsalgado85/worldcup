// ─── Team ───
export interface Team {
  _id: string;
  id: string;
  name_en: string;
  name_fa?: string;
  flag: string;
  fifa_code: string;
  iso2: string;
  groups: string;
}

// ─── Match ───
export interface Match {
  _id: string;
  id: string;
  home_team_id: string;
  away_team_id: string;
  home_score: string;
  away_score: string;
  home_scorers: string;
  away_scorers: string;
  group: string;
  matchday: string;
  local_date: string;
  persian_date?: string;
  stadium_id: string;
  finished: string;
  time_elapsed: string;
  type: 'group' | 'round_of_32' | 'round_of_16' | 'quarter_final' | 'semi_final' | 'final';
  home_team_name_en: string;
  home_team_name_fa?: string;
  away_team_name_en: string;
  away_team_name_fa?: string;
}

// ─── Group Standing ───
export interface StandingTeam {
  team_id: string;
  mp: string;
  w: string;
  l: string;
  d: string;
  pts: string;
  gf: string;
  ga: string;
  gd: string;
}

export interface Group {
  _id: string;
  name: string;
  teams: StandingTeam[];
}

// ─── Stadium ───
export interface Stadium {
  _id: string;
  id: string;
  name_en: string;
  name_fa?: string;
  city_en: string;
  city_fa?: string;
  country_en: string;
  capacity: string;
  image?: string;
  lat?: number;
  lng?: number;
}

// ─── Player (API-Football) ───
export interface Player {
  id: number;
  name: string;
  age: number;
  number: number | null;
  position: string;
  photo: string;
  nationality: string;
  team_id: number;
  team_name: string;
  team_logo: string;
  games?: {
    minutes: number | null;
    number: number;
    position: string;
    rating: string | null;
    captain: boolean;
    substitute: boolean;
  };
  goals?: { total: number | null; assists: number | null };
  cards?: { yellow: number; red: number };
}

// ─── Player Stats ───
export interface PlayerStats {
  player: Player;
  statistics: {
    team: { id: number; name: string; logo: string };
    games: {
      minutes: number;
      number: number;
      position: string;
      rating: string;
      captain: boolean;
      substitute: boolean;
    };
    shots: { total: number; on: number };
    goals: { total: number; assists: number | null };
    passes: { total: number; key: number; accuracy: number };
    tackles: { total: number; blocks: number; interceptions: number };
    duels: { total: number; won: number };
    dribbles: { attempts: number; success: number };
    fouls: { drawn: number; committed: number };
    cards: { yellow: number; red: number };
    penalty: { won: number | null; scored: number; missed: number };
  }[];
}

// ─── API Response Wrappers ───
export interface WCResponse<T> {
  [key: string]: T[];
}

export interface ApiFootballResponse<T> {
  response: T[];
}

// ─── UI State ───
export type ViewMode = 'dashboard' | 'teams' | 'players' | 'matches' | 'stadiums' | 'bracket' | 'rankings' | 'predictions';
