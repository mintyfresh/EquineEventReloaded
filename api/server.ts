import * as events from './server/event';
import * as matches from './server/match';
import * as players from './server/player';

export namespace Server {
  export const listEvents  = events.listEvents;
  export const getEvent    = events.getEvent;
  export const createEvent = events.createEvent;
  export const updateEvent = events.updateEvent;
  export const deleteEvent = events.deleteEvent;

  export const listEventMatches = matches.listEventMatches;
  export const updateEventMatch = matches.updateEventMatch;
  export const deleteEventMatch = matches.deleteEventMatch;

  export const listEventPlayers  = players.listEventPlayers;
  export const getEventPlayer    = players.getEventPlayer;
  export const createEventPlayer = players.createEventPlayer;
  export const updateEventPlayer = players.updateEventPlayer;
  export const deleteEventPlayer = players.deleteEventPlayer;
}
