import { Table } from 'react-bootstrap';
import type { Player, UpdateEventPlayerInput } from '../api/types';
import PlayerListItem from './PlayerList/PlayerListItem';

export interface PlayerListProps {
  players: Player[];
  onPlayerUpdate: (player: Player, input: UpdateEventPlayerInput) => (void | Promise<void>);
  onPlayerDelete: (player: Player) => (void | Promise<void>);
};

const PlayerList: React.FC<PlayerListProps> = ({ players, onPlayerUpdate, onPlayerDelete }) => {
  return (
    <Table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Wins</th>
          <th>Losses</th>
          <th>Ties</th>
          <th>Points</th>
          <th>Opponent Win %</th>
          <th className="text-end">Controls</th>
        </tr>
      </thead>
      <tbody>
        {players.map((player) => (
          <PlayerListItem
            key={player.id}
            player={player}
            onPlayerUpdate={onPlayerUpdate}
            onPlayerDelete={onPlayerDelete}
          />
        ))}
      </tbody>
    </Table>
  );
};

export default PlayerList;
