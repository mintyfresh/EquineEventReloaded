import { createRecord, deleteRecord, getRecordByID, getRecordsByIDs, Record, updateRecord } from './records';

export interface PlayerRecord extends Record {
  type: 'player';
  name: string;
  paid: boolean;
  dropped?: boolean;
}

export const getPlayer = getRecordByID<PlayerRecord>();
export const getPlayers = getRecordsByIDs<PlayerRecord>();

export type CreatePlayerInput = Pick<PlayerRecord, 'name' | 'paid'>;
export const createPlayer = createRecord<PlayerRecord, CreatePlayerInput>('player', {
  name: '',
  paid: false
});

export type UpdatePlayerInput = Pick<PlayerRecord, 'paid' | 'dropped'>;
export const updatePlayer = updateRecord<PlayerRecord, UpdatePlayerInput>();

export const deletePlayer = deleteRecord<PlayerRecord>();
