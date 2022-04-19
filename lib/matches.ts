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
  const response = await fetch(`http://localhost:5984/eer/_design/eer/_view/matches?key=${JSON.stringify([eventId])}`);
  const { rows }: { rows: { value: Match }[] } = await response.json();

  return rows.map((match) => match.value);
};
