import { createBulkRecords, createRecord, deleteBulkRecords, deleteRecord, getRecordByID, getRecordsByIDs, getRecordsByKey, Record, updateRecord } from './records';
import { PlayerRecord } from './players';

export interface MatchRecord extends Record {
  type: 'match';
  event: string;
  games: any[];
  players: [string, string | null];
  rank: number[];
  round: number;
  table: number;
  winner: string | null;
};

export const TIE = 'tie';

export const getMatchByID = getRecordByID<MatchRecord>();
export const getMatchesByIDs = getRecordsByIDs<MatchRecord>();
export const getMatchesByEvent = getRecordsByKey<MatchRecord>('matches');

export type CreateMatchInput = Pick<MatchRecord, 'event'> & Partial<Pick<MatchRecord, 'games' | 'players' | 'rank' | 'round' | 'winner' | 'table'>>;
export const createMatch = createRecord<MatchRecord, CreateMatchInput>('match', {
  event: '',
  games: [],
  players: ['', ''],
  rank: [],
  round: 1,
  table: 1,
  winner: null
});
export const createBulkMatches = createBulkRecords<MatchRecord, CreateMatchInput>('match', {
  event: '',
  games: [],
  players: ['', ''],
  rank: [],
  round: 1,
  table: 1,
  winner: null
});

export type UpdateMatchInput = Pick<MatchRecord, 'winner'>;
export const updateMatch = updateRecord<MatchRecord, UpdateMatchInput>();

export const deleteMatch = deleteRecord<MatchRecord>();
export const deleteBulkMatches = deleteBulkRecords<MatchRecord>();

export const isWinner = (match: MatchRecord, player: PlayerRecord): boolean => {
  return match.winner === player._id;
}

export const isTie = (match: MatchRecord): boolean => {
  return match.winner === TIE;
};

export const isLoser = (match: MatchRecord, player: PlayerRecord): boolean => {
  return !!match.winner && match.winner !== player._id && match.winner !== TIE;
}
