import { ListGroup } from 'react-bootstrap';
import type { Event } from '../lib/events';
import EventListItem from './EventList/EventListItem';

export interface EventListProps {
  events: Event[];
  onEventDelete: (event: Event) => (void | Promise<void>);
}

const EventList: React.FC<EventListProps> = ({ events, onEventDelete }) => {
  return (
    <ListGroup>
      {events.map((event) => (
        <ListGroup.Item key={event._id}>
          <EventListItem event={event} onEventDelete={onEventDelete} />
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

export default EventList;
