import { MatchRecord } from '../../lib/db/matches';
import type { Player } from './player';

export interface Match {
  id: string;
  event: string;
  games: any[];
  players: (Player | null)[];
  rank: number[];
  round: number;
  table: number;
  winner: string | null;
}

export interface ListEventMatchesResponse {
  matches: Match[];
}

export interface GetEventMatchResponse {
  match: Match;
}

export type UpdateEventMatchInput = Partial<Pick<Match, 'winner'>>;

export interface UpdateEventMatchResponse {
  match: Match;
}

export interface DeleteEventMatchResponse {
  ok: boolean;
}

export const serializeMatchRecord = (match: MatchRecord, players: Player[]): Match => ({
    id: match._id,
    event: match.event,
    games: match.games,
    players: players.filter((player) => match.players.includes(player.id)),
    rank: match.rank,
    round: match.round,
    table: match.table,
    winner: match.winner
});
