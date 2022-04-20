import { createRecord, deleteRecord, getRecordsByIDs, Record, updateRecord } from './db';

export interface Player extends Record {
  type: 'player';
  name: string;
  paid: boolean;
  dropped?: boolean;
}

export const getPlayers = getRecordsByIDs<Player>();

export type CreatePlayerInput = Pick<Player, 'name' | 'paid'>;
export const createPlayer = createRecord<Player, CreatePlayerInput>('player', {
  name: '',
  paid: false
});

export type UpdatePlayerInput = Pick<Player, 'paid' | 'dropped'>;
export const updatePlayer = updateRecord<Player, UpdatePlayerInput>();

export const deletePlayer = deleteRecord<Player>();
