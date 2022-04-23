import { createEvent as createEventRecord, CreateEventInput, updateEvent as updateEventRecord, deleteEvent as deleteEventRecord, getEvent as getEventRecord, listEvents as listEventRecords, UpdateEventInput } from '../../lib/db/events';
import { CreateEventResponse, DeleteEventResponse, GetEventResponse, ListEventsResponse, serializeEventRecord, UpdateEventResponse } from '../types/event';

export const listEvents = async (): Promise<ListEventsResponse> => {
  const events = await listEventRecords();

  return {
    events: events.map(serializeEventRecord)
  };
};

export const getEvent = async (eventID: string): Promise<GetEventResponse> => {
  const event = await getEventRecord(eventID);

  return {
    event: serializeEventRecord(event)
  };
};

export const createEvent = async (input: CreateEventInput): Promise<CreateEventResponse> => {
  const event = await createEventRecord(input);

  return {
    event: serializeEventRecord(event)
  };
};

export const updateEvent = async (eventID: string, input: UpdateEventInput): Promise<UpdateEventResponse> => {
  const oldEvent = await getEventRecord(eventID);
  const newEvent = await updateEventRecord(oldEvent, input);

  return {
    event: serializeEventRecord(newEvent)
  };
};

export const deleteEvent = async (eventID: string): Promise<DeleteEventResponse> => {
  await deleteEventRecord({ _id: eventID });

  return { ok: true };
};
