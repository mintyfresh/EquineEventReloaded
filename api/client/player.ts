import type { CreateEventPlayerInput, CreateEventPlayerResponse, DeleteEventPlayerResponse, GetEventPlayerResponse, ListEventPlayersResponse, UpdateEventPlayerInput, UpdateEventPlayerResponse } from '../types/player';

export const listEventPlayers = async (eventID: string): Promise<ListEventPlayersResponse> => {
  const response = await fetch(`/api/events/${eventID}/players`);

  return await response.json();
};

export const getEventPlayer = async (eventID: string, playerID: string): Promise<GetEventPlayerResponse> => {
  const response = await fetch(`/api/events/${eventID}/players/${playerID}`);

  return await response.json();
};

export const createEventPlayer = async (eventID: string, input: CreateEventPlayerInput): Promise<CreateEventPlayerResponse> => {
  const response = await fetch(`/api/events/${eventID}/players`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ input })
  });

  return await response.json();
};

export const updateEventPlayer = async (eventID: string, playerID: string, input: UpdateEventPlayerInput): Promise<UpdateEventPlayerResponse> => {
  const response = await fetch(`/api/events/${eventID}/players/${playerID}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ input })
  });

  return await response.json();
};

export const deleteEventPlayer = async (eventID: string, playerID: string): Promise<DeleteEventPlayerResponse> => {
  const response = await fetch(`/api/events/${eventID}/players/${playerID}`, {
    method: 'DELETE'
  });

  return await response.json();
};
