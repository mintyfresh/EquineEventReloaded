import { useState } from 'react';
import { Button, Col, Form, Row, ToggleButton } from 'react-bootstrap';

export interface CreatePlayerFormProps extends Omit<React.HTMLAttributes<HTMLFormElement>, 'onSubmit'> {
}

const CreatePlayerForm: React.FC<CreatePlayerFormProps> = ({ ...props }) => {
  const [name, setName] = useState('');
  const [paid, setPaid] = useState(true);

  return (
    <Form {...props}>
      <Row className="align-items-center">
        <Col xs="auto">
          <Form.Label htmlFor="create-player-name" visuallyHidden>
            Name
          </Form.Label>
          <Form.Control
            id="create-player-name"
            title="Name"
            placeholder="Player name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </Col>
        <Col xs="auto">
          <ToggleButton
            id="create-player-paid"
            type="checkbox"
            variant={paid ? 'outline-success' : 'outline-danger'}
            checked={paid}
            value="1"
            onChange={(event) => setPaid(event.currentTarget.checked)}
          >
            {paid ? 'Paid' : 'Unpaid'}
          </ToggleButton>
        </Col>
        <Col xs="auto">
          <Button type="submit">
            Add Player
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default CreatePlayerForm;
