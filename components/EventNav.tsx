import { Nav } from 'react-bootstrap';
import type { Event } from '../lib/Event';
import ActiveLink from './ActiveLink';

export interface EventNavProps {
  event: Event;
};

const EventNav: React.FC<EventNavProps> = ({ event }) => {
  return (
    <Nav variant="tabs" className="mb-3">
      <Nav.Item>
        <ActiveLink href="/events/[id]" as={`/events/${event._id}`} passHref>
          <Nav.Link>Status</Nav.Link>
        </ActiveLink>
      </Nav.Item>
      <Nav.Item>
        <ActiveLink href="/events/[id]/players" as={`/events/${event._id}/players`} passHref>
          <Nav.Link>Players</Nav.Link>
        </ActiveLink>
      </Nav.Item>
      <Nav.Item>
        <ActiveLink href="/events/[id]/matches" as={`/events/${event._id}/matches`} passHref>
          <Nav.Link>Matches</Nav.Link>
        </ActiveLink>
      </Nav.Item>
    </Nav>
  );
};

export default EventNav;
