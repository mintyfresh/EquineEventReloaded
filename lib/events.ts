export interface Event {
  _id: string;
  _rev: string;
  type: 'event';
  name: string;
  current_round: number;
  players: string[];
  done: boolean;
  eventType: string;
}

export interface EventCursor {
  id: string;
  value: Event;
}

export const listEvents = async (): Promise<EventCursor[]> => {
  const response = await fetch('http://localhost:5984/eer/_design/eer/_view/events');
  const { rows } = await response.json();

  return rows;
};

export const getEvent = async (id: string | number): Promise<Event> => {
  const response = await fetch(`http://localhost:5984/eer/${id}`);

  return await response.json();
};
