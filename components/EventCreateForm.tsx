import { useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { createEvent, Event } from '../lib/events';

export interface EventCreateFormProps extends Omit<React.HTMLAttributes<HTMLFormElement>, 'onSubmit'> {
  onEventCreate: (event: Event) => (void | Promise<void>);
}

const EventCreateForm: React.FC<EventCreateFormProps> = ({ onEventCreate, ...props }) => {
  const [name, setName] = useState('');

  return (
    <Form {...props} onSubmit={async (event) => {
      event.preventDefault();
      const newEvent = await createEvent({ name });

      await onEventCreate(newEvent);

      // Reset inputs.
      setName('');
    }}>
      <Row className="align-items-center">
        <Col xs="auto">
          <Form.Label htmlFor="create-event-name" visuallyHidden>Name</Form.Label>
          <Form.Control
            id="create-event-name"
            title="Name"
            placeholder="Event name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </Col>
        <Col xs="auto">
          <Button type="submit">
            Add Event
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default EventCreateForm;
