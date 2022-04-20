import * as event from './client/event';
import * as match from './client/match';
import * as player from './client/player';

export namespace Client {
  export const listEvents  = event.listEvents;
  export const getEvent    = event.getEvent;
  export const createEvent = event.createEvent;
  export const deleteEvent = event.deleteEvent;

  export const listEventMatches = match.listEventMatches;
  export const updateEventMatch = match.updateEventMatch;
  export const deleteEventMatch = match.deleteEventMatch;

  export const listEventPlayers  = player.listEventPlayers;
  export const getEventPlayer    = player.getEventPlayer;
  export const createEventPlayer = player.createEventPlayer;
  export const updateEventPlayer = player.updateEventPlayer;
  export const deleteEventPlayer = player.deleteEventPlayer;
}
