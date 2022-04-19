import { concat, map, max, union, without } from 'lodash';
import { v4 as uuid } from 'uuid';

export interface Event {
  _id: string;
  _rev: string;
  type: 'event';
  name: string;
  current_round: number;
  players: string[];
  done: boolean;
  eventType: string;
}

export interface EventCursor {
  id: string;
  value: Event;
}

export const listEvents = async (): Promise<EventCursor[]> => {
  const response = await fetch('http://localhost:5984/eer/_design/eer/_view/events');
  const { rows } = await response.json();

  return rows;
};

export const getEvent = async (id: string): Promise<Event> => {
  const response = await fetch(`http://localhost:5984/eer/${id}`);
  const data = await response.json();

  if (data.error) {
    throw new Error(data.error);
  }

  return data;
};

export const getEvents = async (ids: string[]): Promise<Event[]> => {
  const response = await fetch(`http://localhost:5984/eer/_design/eer/_view/events?keys=${JSON.stringify(ids)}`);
  const { rows }: { rows: { value: Event }[] } = await response.json();

  return rows.map((event) => event.value);
};

export const createEvent = async (input: Pick<Event, 'name'>): Promise<Event> => {
  const payload: Omit<Event, '_rev'> = {
    ...input,
    _id: `event.${uuid()}`,
    type: 'event',
    current_round: 1,
    players: [],
    done: false,
    eventType: 'swiss'
  };

  const response = await fetch('http://localhost:5984/eer', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  const { id, rev } = await response.json();

  return {
    ...payload,
    _id: id,
    _rev: rev
  };
};

export const mergeEvents = async (input: Pick<Event, 'name'>, eventIds: string[]): Promise<Event> => {
  const events = await getEvents(eventIds);

  const payload: Omit<Event, '_rev'> = {
    ...input,
    _id: `event.${uuid()}`,
    type: 'event',
    current_round: max(map(events, 'current_round')) || 1,
    players: concat(...map(events, 'players')),
    done: false,
    eventType: 'swiss'
  };

  const response = await fetch('http://localhost:5984/eer', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  const { id, rev } = await response.json();

  // TODO: Duplicate matches.

  return {
    ...payload,
    _id: id,
    _rev: rev
  };
};

export const addPlayerToEvent = async (eventId: string, playerId: string): Promise<Event> => {
  const oldEvent = await getEvent(eventId);
  const newEvent = {
    ...oldEvent,
    players: union(oldEvent.players, [playerId])
  };

  // Skip the update if the player is already in the event.
  if (oldEvent.players === newEvent.players) {
    return oldEvent;
  };

  const response = await fetch(`http://localhost:5984/eer`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newEvent)
  });

  const { id, rev } = await response.json();

  return {
    ...newEvent,
    _id: id,
    _rev: rev
  };
};

export const removePlayerFromEvent = async (eventId: string, playerId: string): Promise<Event> => {
  const oldEvent = await getEvent(eventId);
  const newEvent = {
    ...oldEvent,
    players: without(oldEvent.players, playerId)
  };

  // Skip the update if the player is not in the event.
  if (oldEvent.players === newEvent.players) {
    return oldEvent;
  }

  const response = await fetch(`http://localhost:5984/eer`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newEvent)
  });

  const { id, rev } = await response.json();

  return {
    ...newEvent,
    _id: id,
    _rev: rev
  };
};
