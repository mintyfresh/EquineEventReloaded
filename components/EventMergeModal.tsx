import { without } from 'lodash';
import { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { Event, mergeEvents } from '../lib/events';

interface EventMergeModalProps {
  events: Event[];
  onEventsMerge: (event: Event) => (void | Promise<void>);
  show: boolean;
  onHide: () => void;
}

const EventMergeModal: React.FC<EventMergeModalProps> = ({ events, onEventsMerge, show, onHide }) => {
  const [name, setName] = useState('');
  const [event1, setEvent1] = useState<Event | null>(null);
  const [event2, setEvent2] = useState<Event | null>(null);

  const findEvent = (id: string) => (
    events.find((event) => event._id === id) || null
  );

  const eventsExcluding = (event: Event | null) => (
    event ? without(events, event) : events
  );

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Merge Events</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form id="merge-events-form" onSubmit={async (event) => {
          event.preventDefault();
          
          if (event1 && event2) {
            const newEvent = await mergeEvents({ name }, [event1._id, event2._id]);
            await onEventsMerge(newEvent);

            setName('');
            setEvent1(null);
            setEvent2(null);
          }
        }}>
          <Form.Group className="mb-3">
            <Form.Label>Event Name</Form.Label>
            <Form.Control
              title="Event Name"
              value={name}
              onChange={(event) => setName(event.currentTarget.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>First Event</Form.Label>
            <Form.Select
              title="Select an event"
              value={event1?._id || ''}
              onChange={(event) => setEvent1(findEvent(event.currentTarget.value))}
            >
              <option value=""></option>
              {eventsExcluding(event2).map((event) => (
                <option key={event._id} value={event._id}>
                  {event.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group>
            <Form.Label>Second Event</Form.Label>
            <Form.Select
              title="Select an event"
              value={event2?._id || ''}
              onChange={(event) => setEvent2(findEvent(event.currentTarget.value))}
            >
              <option value=""></option>
              {eventsExcluding(event1).map((event) => (
                <option key={event._id} value={event._id}>
                  {event.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button type="submit" form="merge-events-form">
          Merge Events
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EventMergeModal;
