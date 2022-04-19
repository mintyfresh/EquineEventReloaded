import Link from 'next/link';
import { Dropdown } from 'react-bootstrap';
import { deleteEvent, Event } from '../../lib/events';
import EllipsisDropdown from '../EllipsisDropdown';

export interface EventListItemProps {
  event: Event;
  onEventDelete: (event: Event) => (void | Promise<void>);
}

const EventListItem: React.FC<EventListItemProps> = ({ event, onEventDelete }) => {
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
        <Dropdown.Item className="text-danger" onClick={async () => {
          if (confirm(`Are you sure you want to delete "${event.name}"?`)) {
            await deleteEvent(event);
            await onEventDelete(event);
          }
        }}>
          Delete
        </Dropdown.Item>
      </EllipsisDropdown>
    </>
  );
};

export default EventListItem;
