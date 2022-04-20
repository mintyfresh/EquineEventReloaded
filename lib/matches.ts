import { createRecord, deleteRecord, getRecordsByKey, Record, updateRecord } from './db';
import { Player } from './players';

export interface Match extends Record {
  type: 'match';
  event: string;
  games: any[];
  players: string[];
  rank: number[];
  round: number;
  table: number;
  winner: string | null;
};

export const TIE = 'tie';

export const getMatchesByEvent = getRecordsByKey<Match>('matches');

export type CreateMatchInput = Pick<Match, 'event'> & Partial<Pick<Match, 'games' | 'players' | 'rank' | 'round' | 'winner'>>;
export const createMatch = createRecord<Match, CreateMatchInput>('match', {
  event: '',
  games: [],
  players: [],
  rank: [],
  round: 1,
  table: 1,
  winner: null
});

export type UpdateMatchInput = Pick<Match, 'winner'>;
export const updateMatch = updateRecord<Match, UpdateMatchInput>();

export const deleteMatch = deleteRecord<Match>();

export const isWinner = (match: Match, player: Player): boolean => {
  return match.winner === player._id;
}

export const isTie = (match: Match): boolean => {
  return match.winner === TIE;
};

export const isLoser = (match: Match, player: Player): boolean => {
  return !!match.winner && match.winner !== player._id && match.winner !== TIE;
}
