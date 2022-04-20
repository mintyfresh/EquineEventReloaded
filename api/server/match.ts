import { sortBy } from 'lodash';
import { getEvent } from '../../lib/db/events';
import { deleteMatch, getMatchesByEvent, updateMatch } from '../../lib/db/matches';
import { getPlayers } from '../../lib/db/players';
import { DeleteEventMatchResponse, ListEventMatchesResponse, serializeMatchRecord, serializePlayerRecord, UpdateEventMatchResponse } from '../types';

export const listEventMatches = async (eventID: string): Promise<ListEventMatchesResponse> => {
  const event = await getEvent(eventID);
  const matches = sortBy(await getMatchesByEvent(eventID), 'round', 'table');
  const players = (await getPlayers(event.players)).map((player) =>
    serializePlayerRecord(player, matches)
  );

  return {
    matches: matches.map((match) =>
      serializeMatchRecord(match, players)
    )
  };
};

export const updateEventMatch = async (eventID: string, matchID: string, input: any): Promise<UpdateEventMatchResponse> => {
  const event = await getEvent(eventID);
  const matches = await getMatchesByEvent(eventID);
  const players = (await getPlayers(event.players)).map((player) =>
    serializePlayerRecord(player, matches)
  );

  const oldMatch = matches.find((match) => match._id === matchID);

  if (!oldMatch) {
    throw new Error('Match not found');
  }

  const newMatch = await updateMatch(oldMatch, input);

  return {
    match: serializeMatchRecord(newMatch, players)
  };
};

export const deleteEventMatch = async (eventID: string, matchID: string): Promise<DeleteEventMatchResponse> => {
  const matches = await getMatchesByEvent(eventID);
  const match = matches.find((match) => match._id === matchID);

  if (match) {
    await deleteMatch(match);
  }

  return { ok: true };
};
