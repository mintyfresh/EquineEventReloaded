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

export const getEvent = async (id: string | number): Promise<Event> => {
  const response = await fetch(`http://localhost:5984/eer/${id}`);

  return await response.json();
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

export const addPlayerToEvent = async (eventId: string, playerId: string): Promise<Event> => {
  const oldEvent = await getEvent(eventId);
  const newEvent = {
    ...oldEvent,
    players: [...oldEvent.players, playerId]
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
