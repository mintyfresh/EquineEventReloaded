import { concat, map, max, union } from 'lodash';
import { createRecord, deleteRecord, getRecordsByIds, Record, RecordList, updateRecord } from './db';

export interface Event extends Record {
  type: 'event';
  name: string;
  current_round: number;
  players: string[];
  done: boolean;
  eventType: string;
}

export const listEvents = async (): Promise<Event[]> => {
  const response = await fetch('http://localhost:5984/eer/_design/eer/_view/events');
  const { rows }: RecordList<Event> = await response.json();

  return rows.map((event) => event.value);
};

export const getEvent = async (id: string): Promise<Event> => {
  const response = await fetch(`http://localhost:5984/eer/${id}`);
  const data = await response.json();

  if (data.error) {
    throw new Error(data.error);
  }

  return data;
};

export const getEvents = getRecordsByIds<Event>('events');

export type CreateEventInput = Pick<Event, 'name'> & Partial<Pick<Event, 'current_round' | 'players'>>;
export const createEvent = createRecord<Event, CreateEventInput>('event', {
  name: '',
  current_round: 1,
  players: [],
  done: false,
  eventType: 'swiss'
});

export type UpdateEventInput = Pick<Event, 'name' | 'players' | 'done'>;
export const updateEvent = updateRecord<Event, UpdateEventInput>();

export const deleteEvent = deleteRecord<Event>();

export const mergeEvents = async (input: CreateEventInput, eventIds: string[]): Promise<Event> => {
  const events = await getEvents(eventIds);
  const newEvent = await createEvent({
    ...input,
    current_round: max(map(events, 'current_round')) || 1,
    players: concat(...map(events, 'players')),
  });

  // TODO: Duplicate matches.

  return newEvent;
};

export const addPlayerToEvent = async (eventId: string, playerId: string): Promise<Event> => {
  const oldEvent = await getEvent(eventId);
  const players = union(oldEvent.players, [playerId]);

  // Skip the update if the player is already in the event.
  if (oldEvent.players === players) {
    return oldEvent;
  };

  return updateEvent(oldEvent, { players });
};

export const removePlayerFromEvent = async (eventId: string, playerId: string): Promise<Event> => {
  const oldEvent = await getEvent(eventId);
  const players = oldEvent.players.filter((id) => id !== playerId);

  // Skip the update if the player is not in the event.
  if (oldEvent.players === players) {
    return oldEvent;
  }

  return updateEvent(oldEvent, { players });
};
