import { ListGroup } from 'react-bootstrap';
import type { Player } from '../lib/players';
import PlayerListItem from './PlayerList/PlayerListItem';

export interface PlayerListProps {
  players: Player[];
  onPlayerDelete: (player: Player) => (void | Promise<void>);
};

const PlayerList: React.FC<PlayerListProps> = ({ players, onPlayerDelete }) => {
  return (
    <ListGroup>
      {players.map((player) => (
        <ListGroup.Item key={player._id}>
          <PlayerListItem player={player} onPlayerDelete={onPlayerDelete} />
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

export default PlayerList;
