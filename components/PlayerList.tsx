import { ListGroup } from 'react-bootstrap';
import type { Player } from '../lib/players';

export interface PlayerListProps {
  players: Player[];
};

const PlayerList: React.FC<PlayerListProps> = ({ players }) => {
  return (
    <ListGroup>
      {players.map((player) => (
        <ListGroup.Item key={player._id}>
          {player.name}
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

export default PlayerList;
