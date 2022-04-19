export interface Player {
  _id: string;
  _rev: string;
  type: 'player';
  name: string;
  paid: boolean;
  dropped?: boolean;
}

export interface PlayerCursor {
  id: string;
  value: Player;
}

export const getPlayers = async (ids: string[]): Promise<PlayerCursor[]> => {
  const response = await fetch(`http://localhost:5984/eer/_design/eer/_view/players?keys=${JSON.stringify(ids)}`);
  const { rows } = await response.json();

  return rows;
};
