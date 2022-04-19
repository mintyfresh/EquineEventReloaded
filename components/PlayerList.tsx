import { ListGroup } from 'react-bootstrap';
import type { Player } from '../lib/players';
import PlayerListItem from './PlayerList/PlayerListItem';

export interface PlayerListProps {
  players: Player[];
  onPlayerUpdate: (player: Player) => (void | Promise<void>);
  onPlayerDelete: (player: Player) => (void | Promise<void>);
};

const PlayerList: React.FC<PlayerListProps> = ({ players, onPlayerUpdate, onPlayerDelete }) => {
  return (
    <ListGroup>
      {players.map((player) => (
        <ListGroup.Item key={player._id}>
          <PlayerListItem
            player={player}
            onPlayerUpdate={onPlayerUpdate}
            onPlayerDelete={onPlayerDelete}
          />
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

export default PlayerList;
