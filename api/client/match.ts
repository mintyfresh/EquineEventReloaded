import type { ListEventMatchesResponse, UpdateEventMatchInput, UpdateEventMatchResponse } from '../types';

export const listEventMatches = async (eventID: string): Promise<ListEventMatchesResponse> => {
  const response = await fetch(`/api/events/${eventID}/matches`);

  return await response.json();
};

export const updateEventMatch = async (eventID: string, matchID: string, input: UpdateEventMatchInput): Promise<UpdateEventMatchResponse> => {
  const response = await fetch(`/api/events/${eventID}/matches/${matchID}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ input })
  });

  return await response.json();
};

export const deleteEventMatch = async (eventID: string, matchID: string): Promise<void> => {
  await fetch(`/api/events/${eventID}/matches/${matchID}`, {
    method: 'DELETE'
  });
}
