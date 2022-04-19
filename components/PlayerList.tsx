import { ListGroup } from 'react-bootstrap';
import type { Player } from '../lib/players';
import PlayerControls from './PlayerList/PlayerControls';

export interface PlayerListProps {
  players: Player[];
};

const PlayerList: React.FC<PlayerListProps> = ({ players }) => {
  return (
    <ListGroup>
      {players.map((player) => (
        <ListGroup.Item key={player._id}>
          {player.name}
          <PlayerControls player={player} />
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

export default PlayerList;
