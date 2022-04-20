import { useState } from 'react';
import { Button, Col, Form, Row, ToggleButton } from 'react-bootstrap';
import { createPlayer, PlayerRecord } from '../lib/db/players';

export interface PlayerCreateFormProps extends Omit<React.HTMLAttributes<HTMLFormElement>, 'onSubmit'> {
  onPlayerCreate: (player: PlayerRecord) => (void | Promise<void>);
}

const PlayerCreateForm: React.FC<PlayerCreateFormProps> = ({ onPlayerCreate, ...props }) => {
  const [name, setName] = useState('');
  const [paid, setPaid] = useState(true);

  return (
    <Form {...props} onSubmit={async (event) => {
      event.preventDefault();
      const player = await createPlayer({ name, paid });

      await onPlayerCreate(player);

      // Reset inputs.
      setName('');
      setPaid(true);
    }}>
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

export default PlayerCreateForm;
