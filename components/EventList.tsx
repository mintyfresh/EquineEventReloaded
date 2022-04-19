import { ListGroup } from 'react-bootstrap';
import type { Event } from '../lib/events';
import EventListItem from './EventList/EventListItem';

export interface EventListProps {
  events: Event[];
}

const EventList: React.FC<EventListProps> = ({ events }) => {
  return (
    <ListGroup>
      {events.map((event) => (
        <ListGroup.Item key={event._id}>
          <EventListItem event={event} />
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

export default EventList;
