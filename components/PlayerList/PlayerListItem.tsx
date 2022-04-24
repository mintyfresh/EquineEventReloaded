import { Badge, Dropdown } from 'react-bootstrap';
import type { Player, UpdateEventPlayerInput } from '../../api/types';
import EllipsisDropdown from '../EllipsisDropdown';

const UnpaidBadge = () => (
  <Badge pill bg="warning" text="dark" className="ms-2">unpaid</Badge>
);

const DroppedBadge = () => (
  <Badge pill bg="danger" className="ms-2">dropped</Badge>
);

export interface PlayerListItemProps {
  player: Player;
  onPlayerUpdate: (player: Player, input: UpdateEventPlayerInput) => (void | Promise<void>);
  onPlayerDelete: (player: Player) => (void | Promise<void>);
}

const PlayerListItem: React.FC<PlayerListItemProps> = ({ player, onPlayerUpdate, onPlayerDelete }) => {
  const toggleAttribute = async (name: keyof Player) => {
    await onPlayerUpdate(player, { [name]: !player[name] });
  };

  return (
    <tr>
      <td>
        {player.name}
        {player.paid || <UnpaidBadge />}
        {player.dropped && <DroppedBadge />}
      </td>
      <td>{player.wins}</td>
      <td>{player.losses}</td>
      <td>{player.ties}</td>
      <td>{player.points}</td>
      <td>{(player.opponentWinPercentage * 100).toFixed(2)}%</td>
      <td>
        <EllipsisDropdown className="float-end">
          <Dropdown.Item onClick={() => toggleAttribute('paid')}>
            Mark {player.paid ? 'unpaid' : 'paid'}
          </Dropdown.Item>
          <Dropdown.Item onClick={() => toggleAttribute('dropped')}>
            {player.dropped ? 'Restore' : 'Drop'}
          </Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item className="text-danger" onClick={async () => {
            if (confirm(`Are you sure you want to delete "${player.name}"?`)) {
              await onPlayerDelete(player);
            }
          }}>
            Delete
          </Dropdown.Item>
        </EllipsisDropdown>
      </td>
    </tr>
  );
};

export default PlayerListItem;
