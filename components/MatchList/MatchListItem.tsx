import { Match } from '../../lib/matches';
import { Player } from '../../lib/players';

export interface MatchListItemProps {
  match: Match;
  players: Player[];
}

const MatchListItem: React.FC<MatchListItemProps> = ({ match, players }) => {
  const player1 = players.find((player) => player._id === match.players[0]);
  const player2 = players.find((player) => player._id === match.players[1]);

  return (
    <div>
      Table {match.table}{': '}
      {player1?.name ?? <span className="text-muted">None</span>} vs.{' '}
      {player2?.name ?? <span className="text-muted">None</span>}
    </div>
  );
};

export default MatchListItem;
