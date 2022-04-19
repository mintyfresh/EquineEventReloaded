import { v4 as uuid } from 'uuid';

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

export const getPlayers = async (ids: string[]): Promise<Player[]> => {
  const response = await fetch(`http://localhost:5984/eer/_design/eer/_view/players?keys=${JSON.stringify(ids)}`);
  const { rows }: { rows: PlayerCursor[] } = await response.json();

  return rows.map((player) => player.value);
};

export const createPlayer = async (input: Omit<Player, '_id' | '_rev' | 'type'>): Promise<Player> => {
  const player: Omit<Player, '_rev'> = {
    ...input,
    _id: `player.${uuid()}`,
    type: 'player'
  };

  const response = await fetch('http://localhost:5984/eer', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(player)
  });

  const { id, rev } = await response.json();

  return {
    ...player,
    _id: id,
    _rev: rev
  };
};

export const deletePlayer = async (player: Player): Promise<void> => {
  await fetch(`http://localhost:5984/eer/${player._id}?rev=${player._rev}`, {
    method: 'DELETE'
  });
};
