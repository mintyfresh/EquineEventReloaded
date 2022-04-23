import { map, max, union } from 'lodash';
import { createRecord, deleteRecord, getRecordsByIDs, Record, RecordList, updateRecord } from './records';
import { createMatch, getMatchesByEvent } from './matches';

export interface EventRecord extends Record {
  type: 'event';
  name: string;
  current_round: number;
  players: string[];
  done: boolean;
  eventType: string;
}

export const listEvents = async (): Promise<EventRecord[]> => {
  const response = await fetch('http://localhost:5984/eer/_design/eer/_view/events');
  const { rows }: RecordList<EventRecord> = await response.json();

  return rows.map((event) => event.value);
};

export const getEvent = async (id: string): Promise<EventRecord> => {
  const response = await fetch(`http://localhost:5984/eer/${id}`);
  const data = await response.json();

  if (data.error) {
    throw new Error(data.error);
  }

  return data;
};

export const getEvents = getRecordsByIDs<EventRecord>();

export type CreateEventInput = Pick<EventRecord, 'name'> & Partial<Pick<EventRecord, 'current_round' | 'players'>>;
export const createEvent = createRecord<EventRecord, CreateEventInput>('event', {
  name: '',
  current_round: 1,
  players: [],
  done: false,
  eventType: 'swiss'
});

export type UpdateEventInput = Partial<Pick<EventRecord, 'name' | 'players' | 'done' | 'current_round'>>;
export const updateEvent = updateRecord<EventRecord, UpdateEventInput>();

export const deleteEvent = deleteRecord<EventRecord>();

export const mergeEvents = async (input: CreateEventInput, eventIds: string[]): Promise<EventRecord> => {
  const events = await getEvents(eventIds);
  const matches = await (await Promise.all(eventIds.map((id) => getMatchesByEvent(id)))).flat();

  const newEvent = await createEvent({
    ...input,
    current_round: max(map(events, 'current_round')) || 1,
    players: [...events.flatMap((event) => event.players)],
  });

  await Promise.all(
    // TODO: Perform a bulk operation.
    matches.map((match) => createMatch({
      ...match,
      event: newEvent._id,
      games: [...match.games],
      players: [...match.players],
      rank: [...match.rank]
    }))
  );

  return newEvent;
};

export const addPlayerToEvent = async (eventId: string, playerId: string): Promise<EventRecord> => {
  const oldEvent = await getEvent(eventId);
  const players = union(oldEvent.players, [playerId]);

  // Skip the update if the player is already in the event.
  if (oldEvent.players === players) {
    return oldEvent;
  };

  return updateEvent(oldEvent, { players });
};

export const removePlayerFromEvent = async (eventId: string, playerId: string): Promise<EventRecord> => {
  const oldEvent = await getEvent(eventId);
  const players = oldEvent.players.filter((id) => id !== playerId);

  // Skip the update if the player is not in the event.
  if (oldEvent.players === players) {
    return oldEvent;
  }

  return updateEvent(oldEvent, { players });
};
