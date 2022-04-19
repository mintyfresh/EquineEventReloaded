import { Record, updateRecord } from './db';
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

export const getMatches = async (eventId: string): Promise<Match[]> => {
  const response = await fetch(`http://localhost:5984/eer/_design/eer/_view/matches?key=${JSON.stringify([eventId])}`);
  const { rows }: { rows: { value: Match }[] } = await response.json();

  return rows.map((match) => match.value);
};

export type UpdateMatchInput = Pick<Match, 'winner'>;
export const updateMatch = updateRecord<Match, UpdateMatchInput>();


export const isWinner = (match: Match, player: Player): boolean => {
  return match.winner === player._id;
}

export const isTie = (match: Match): boolean => {
  return match.winner === 'tie';
};

export const isLoser = (match: Match, player: Player): boolean => {
  return !!match.winner && match.winner !== player._id && match.winner !== 'tie';
}
