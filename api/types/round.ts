import type { Event } from './event';
import type { Match } from './match';

export interface CreateNextRoundResponse {
  event: Event;
  matches: Match[];
}

export interface DeleteCurrentRoundResponse {
  event: Event;
}
