import { faCrown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import type { Match, Player, UpdateEventMatchInput } from '../../api/types';
import EllipsisDropdown from '../EllipsisDropdown';
import MatchResolutionModal from './MatchResolutionModal';

export interface MatchListItemProps {
  match: Match;
  onMatchUpdate: (match: Match, input: UpdateEventMatchInput) => (void | Promise<void>);
  onMatchDelete: (match: Match) => (void | Promise<void>);
}

const MatchListItem: React.FC<MatchListItemProps> = ({ match, onMatchUpdate, onMatchDelete }) => {
  const [showResolutionModal, setShowResolutionModal] = useState(false);

  const player1 = match.players[0];
  const player2 = match.players[1];

  const isWinner = (player: Player) => player.id === match.winner;

  const PlayerName = ({ player }: { player: Player | null }) => {
    if (!player) {
      return (
        <span className="text-muted">
          None
        </span>
      );
    }

    return (
      <>
        {isWinner(player) && (
          <FontAwesomeIcon icon={faCrown} className="me-1" color="gold" />
        )}
        {player.name}
      </>
    );
  };

  return (
    <>
      Table {match.table}{': '}
      <PlayerName player={player1} /> vs. <PlayerName player={player2} />
      {' '}|{' '}
      {player1?.points || 0} vs. {player2?.points || 0}
      <EllipsisDropdown className="float-end">
        <Dropdown.Item
          disabled={!player2}
          onClick={() => setShowResolutionModal(true)}
        >
          Select Winner
        </Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item className="text-danger" onClick={async () => {
          if (confirm(`Are you sure you want to delete "${match.id}"?`)) {
            await onMatchDelete(match);
          }
        }}>Delete</Dropdown.Item>
      </EllipsisDropdown>
      <MatchResolutionModal
        match={match}
        show={showResolutionModal}
        onHide={() => setShowResolutionModal(false)}
        onWinnerSelect={async (match, input) => {
          setShowResolutionModal(false);
          await onMatchUpdate(match, input);
        }}
      />
    </>
  );
};

export default MatchListItem;
