import { useEffect, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { Match, updateMatch } from '../../lib/matches';
import type { Player } from '../../lib/players';

export interface MatchResolutionModalProps {
  show: boolean;
  onHide: () => void;
  match: Match;
  players: Player[];
  onWinnerSelect: (match: Match) => (void | Promise<void>);
}

const MatchResolutionModal: React.FC<MatchResolutionModalProps> = ({ show, onHide, match, players, onWinnerSelect }) => {
  const [winner, setWinner] = useState(match.winner || '');

  useEffect(() => {
    // Reset winner when modal closes
    setWinner(match.winner || '');
  }, [match.winner, show]);

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{players[0]?.name || 'None'} vs. {players[1]?.name || 'None'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form id="match-winner-form" onSubmit={async (event) => {
          event.preventDefault();

          const updatedMatch = await updateMatch(match, {
            winner: winner === '' ? null : winner
          });

          await onWinnerSelect(updatedMatch);
        }}>
          <Form.Label>Winner</Form.Label>
          <Form.Select
            title="Winner"
            value={winner || ''}
            onChange={(event) => setWinner(event.currentTarget.value)}
          >
            <option>None</option>
            {players.map((player) => (
              <option key={player._id} value={player._id}>
                Player: {player.name}
              </option>
            ))}
            <option value="tie">Tie</option>
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
