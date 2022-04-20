import { isNull } from 'lodash';
import { useEffect, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import type { Match, Player, UpdateEventMatchInput } from '../../api/types';
import { TIE } from '../../lib/db/matches';

export interface MatchResolutionModalProps {
  show: boolean;
  onHide: () => void;
  match: Match;
  onWinnerSelect: (match: Match, input: UpdateEventMatchInput) => (void | Promise<void>);
}

const MatchResolutionModal: React.FC<MatchResolutionModalProps> = ({ show, onHide, match, onWinnerSelect }) => {
  const [winner, setWinner] = useState(match.winner || '');

  useEffect(() => {
    // Reset winner when modal closes
    setWinner(match.winner || '');
  }, [match.winner, show]);

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{match.players[0]?.name || 'None'} vs. {match.players[1]?.name || 'None'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form id="match-winner-form" onSubmit={async (event) => {
          event.preventDefault();
          await onWinnerSelect(match, { winner });
        }}>
          <Form.Label>Winner</Form.Label>
          <Form.Select
            title="Winner"
            value={winner || ''}
            onChange={(event) => setWinner(event.currentTarget.value)}
          >
            <option>None</option>
            {match.players.map((player) => (
              player && <option key={player.id} value={player.id}>
                Player: {player.name}
              </option>
            ))}
            <option value={TIE}>Tie</option>
          </Form.Select>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button type="submit" form="match-winner-form">
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  )
};

export default MatchResolutionModal;
