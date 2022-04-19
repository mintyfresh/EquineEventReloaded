import { useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import { Match } from '../../lib/matches';
import { Player } from '../../lib/players';
import EllipsisDropdown from '../EllipsisDropdown';
import MatchResolutionModal from './MatchResolutionModal';

export interface MatchListItemProps {
  match: Match;
  players: Player[];
  onMatchUpdate: (match: Match) => (void | Promise<void>);
}

const MatchListItem: React.FC<MatchListItemProps> = ({ match, players, onMatchUpdate }) => {
  const [showResolutionModal, setShowResolutionModal] = useState(false);

  const player1 = players.find((player) => player._id === match.players[0]);
  const player2 = players.find((player) => player._id === match.players[1]);

  return (
    <>
      Table {match.table}{': '}
      {player1?.name ?? <span className="text-muted">None</span>} vs.{' '}
      {player2?.name ?? <span className="text-muted">None</span>}
      <EllipsisDropdown className="float-end">
        <Dropdown.Item onClick={() => setShowResolutionModal(true)}>Select Winner</Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item className="text-danger">Delete</Dropdown.Item>
      </EllipsisDropdown>
      <MatchResolutionModal
        match={match}
        players={players}
        show={showResolutionModal}
        onHide={() => setShowResolutionModal(false)}
        onWinnerSelect={(match) => {
          setShowResolutionModal(false);
          onMatchUpdate(match);
        }}
      />
    </>
  );
};

export default MatchListItem;
