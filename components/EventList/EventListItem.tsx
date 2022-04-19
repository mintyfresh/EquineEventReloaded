import Link from 'next/link';
import { Dropdown } from 'react-bootstrap';
import type { Event } from '../../lib/events';
import EllipsisDropdown from '../EllipsisDropdown';

export interface EventListItemProps {
  event: Event;
}

const EventListItem: React.FC<EventListItemProps> = ({ event }) => {
  const deleteEvent = () => {
    confirm(`Are you sure you want to delete "${event.name}"?`);
    // TODO: Delete event
  };

  return (
    <>
      <Link href="/events/[id]" as={`/events/${event._id}`}>
        {event.name}
      </Link>
      <EllipsisDropdown className="float-end">
        <Dropdown.Item>
          Merge with...
        </Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item className="text-danger" onClick={() => deleteEvent()}>
          Delete
        </Dropdown.Item>
      </EllipsisDropdown>
    </>
  );
};

export default EventListItem;
