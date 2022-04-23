import type { EventRecord } from '../../lib/db/events';

export interface Event {
  id: string;
  name: string;
  players: string[];
  currentRound: number;
  done: boolean;
}

export interface ListEventsResponse {
  events: Event[];
}

export interface GetEventResponse {
  event: Event;
}

export type CreateEventInput = Pick<Event, 'name'>;

export interface CreateEventResponse {
  event: Event;
}

export interface UpdateEventResponse {
  event: Event;
}

export interface DeleteEventResponse {
  ok: boolean;
}

export const serializeEventRecord = (event: EventRecord): Event => {
  return {
    id: event._id,
    name: event.name,
    players: event.players,
    currentRound: event.current_round,
    done: event.done
  };
};
