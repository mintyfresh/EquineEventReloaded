import type { Event } from './events';
import type { Player } from './players';

export interface Match {
  _id: string;
  _rev: string;
  type: 'match';
  event: string;
  games: any[];
  players: string[];
  rank: number[];
  round: number;
  table: number;
  winner: string;
};

export const getMatches = async (eventId: string): Promise<Match[]> => {
  console.log(`http://localhost:5984/eer/_design/eer/_view/matches?key=${JSON.stringify([eventId])}`);
  const response = await fetch(`http://localhost:5984/eer/_design/eer/_view/matches?key=${JSON.stringify([eventId])}`);
  const { rows }: { rows: { value: Match }[] } = await response.json();

  return rows.map((match) => match.value);
};

export const getMatchPoints = (event: Event, player: Player): number => {
  return 0; // TODO;
};
