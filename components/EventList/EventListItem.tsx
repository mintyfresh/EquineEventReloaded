import Link from 'next/link';
import { Dropdown } from 'react-bootstrap';
import type { Event } from '../../api/types';
import EllipsisDropdown from '../EllipsisDropdown';

export interface EventListItemProps {
  event: Event;
  onEventDelete: (event: Event) => (void | Promise<void>);
}

const EventListItem: React.FC<EventListItemProps> = ({ event, onEventDelete }) => {
  return (
    <>
      <Link href="/events/[id]" as={`/events/${event.id}`}>
        {event.name}
      </Link>
      <EllipsisDropdown className="float-end">
        <Dropdown.Item className="text-danger" onClick={async () => {
          if (confirm(`Are you sure you want to delete "${event.name}"?`)) {
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
