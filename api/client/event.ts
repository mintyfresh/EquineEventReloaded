import type { CreateEventInput, CreateEventResponse, GetEventResponse, ListEventsResponse } from '../types/event';

export const listEvents = async (): Promise<ListEventsResponse> => {
  const response = await fetch('/api/events');

  return await response.json();
};

export const getEvent = async (eventID: string): Promise<GetEventResponse> => {
  const response = await fetch(`/api/events/${eventID}`);

  return await response.json();
};

export const createEvent = async (input: CreateEventInput): Promise<CreateEventResponse> => {
  const response = await fetch('/api/events', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ input })
  });

  return await response.json();
};

export const deleteEvent = async (eventID: string): Promise<void> => {
  await fetch(`/api/events/${eventID}`, {
    method: 'DELETE'
  });
};
