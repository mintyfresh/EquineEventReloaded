import { Badge, Dropdown } from 'react-bootstrap';
import { deletePlayer, Player, updatePlayer } from '../../lib/players';
import EllipsisDropdown from '../EllipsisDropdown';

const UnpaidBadge = () => (
  <Badge pill bg="warning" text="dark" className="ms-2">unpaid</Badge>
);

const DroppedBadge = () => (
  <Badge pill bg="danger" className="ms-2">dropped</Badge>
);

export interface PlayerListItemProps {
  player: Player;
  onPlayerUpdate: (player: Player) => (void | Promise<void>);
  onPlayerDelete: (player: Player) => (void | Promise<void>);
}

const PlayerListItem: React.FC<PlayerListItemProps> = ({ player, onPlayerUpdate, onPlayerDelete }) => {
  const toggleAttribute = async (name: keyof Player) => {
    const updatedPlayer = await updatePlayer(player, { [name]: !player[name] });

    await onPlayerUpdate(updatedPlayer);
  };

  return (
    <>
      {player.name}
      {player.paid || <UnpaidBadge />}
      {player.dropped && <DroppedBadge />}
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
            await deletePlayer(player);
            await onPlayerDelete(player);
          }
        }}>
          Delete
        </Dropdown.Item>
      </EllipsisDropdown>
    </>
  );
};

export default PlayerListItem;
