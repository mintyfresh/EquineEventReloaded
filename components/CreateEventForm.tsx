import { useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';

export interface CreateEventFormProps extends Omit<React.HTMLAttributes<HTMLFormElement>, 'onSubmit'> {
}

const CreateEventForm: React.FC<CreateEventFormProps> = ({ ...props }) => {
  const [name, setName] = useState('');

  return (
    <Form {...props}>
      <Row className="align-items-center">
        <Col xs="auto">
          <Form.Label for="create-event-name" visuallyHidden>Name</Form.Label>
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

export default CreateEventForm;
