import Link from 'next/link';
import { ListGroup } from 'react-bootstrap';
import type { Event } from '../lib/Event';

export interface EventListProps {
  events: Event[];
}

const EventList: React.FC<EventListProps> = ({ events }) => {
  return (
    <ListGroup>
      {events.map((event) => (
        <ListGroup.Item key={event.id}>
          <Link href="/events/[id]" as={`/events/${event.id}`}>
            {event.value.name}
          </Link>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

export default EventList;
