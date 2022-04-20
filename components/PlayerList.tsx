import { ListGroup } from 'react-bootstrap';
import type { Player, UpdateEventPlayerInput } from '../api/types';
import PlayerListItem from './PlayerList/PlayerListItem';

export interface PlayerListProps {
  players: Player[];
  onPlayerUpdate: (player: Player, input: UpdateEventPlayerInput) => (void | Promise<void>);
  onPlayerDelete: (player: Player) => (void | Promise<void>);
};

const PlayerList: React.FC<PlayerListProps> = ({ players, onPlayerUpdate, onPlayerDelete }) => {
  return (
    <ListGroup>
      {players.map((player) => (
        <ListGroup.Item key={player.id}>
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
