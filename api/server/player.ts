import { addPlayerToEvent, getEvent, removePlayerFromEvent } from '../../lib/db/events';
import { getMatchesByEvent } from '../../lib/db/matches';
import { createPlayer as createPlayerRecord, deletePlayer as deletePlayerRecord, getPlayer as getPlayerRecord, getPlayers, updatePlayer as updatePlayerRecord } from '../../lib/db/players';
import { serializeEventRecord } from '../types/event';
import { CreateEventPlayerInput, CreateEventPlayerResponse, DeleteEventPlayerResponse, GetEventPlayerResponse, ListEventPlayersResponse, serializePlayerRecord, UpdateEventPlayerInput, UpdateEventPlayerResponse } from '../types/player';

export const listEventPlayers = async (eventID: string): Promise<ListEventPlayersResponse> => {
  const event = await getEvent(eventID);
  const matches = await getMatchesByEvent(event._id);
  const players = await getPlayers(event.players);

  return {
    event: serializeEventRecord(event),
    players: players.map((player) => serializePlayerRecord(player, matches))
  }
};

export const createEventPlayer = async (eventID: string, input: CreateEventPlayerInput): Promise<CreateEventPlayerResponse> => {
  const player = await createPlayerRecord(input);
  const event = await addPlayerToEvent(eventID, player._id);

  return {
    event: serializeEventRecord(event),
    player: serializePlayerRecord(player, [])
  };
};

export const getEventPlayer = async (eventID: string, playerID: string): Promise<GetEventPlayerResponse> => {
  const event = await getEvent(eventID);
  const matches = await getMatchesByEvent(event._id);
  const player = await getPlayerRecord(playerID);

  return {
    event: serializeEventRecord(event),
    player: serializePlayerRecord(player, matches)
  };
};

export const updateEventPlayer = async (eventID: string, playerID: string, input: UpdateEventPlayerInput): Promise<UpdateEventPlayerResponse> => {
  const event = await getEvent(eventID);
  const matches = await getMatchesByEvent(event._id);

  const oldPlayer = await getPlayerRecord(playerID);
  const newPlayer = await updatePlayerRecord(oldPlayer, input);

  return {
    event: serializeEventRecord(event),
    player: serializePlayerRecord(newPlayer, matches)
  };
};

export const deleteEventPlayer = async (eventID: string, playerID: string): Promise<DeleteEventPlayerResponse> => {
  const event = await removePlayerFromEvent(eventID, playerID);
  await deletePlayerRecord({ _id: playerID });

  return {
    event: serializeEventRecord(event)
  };
};
