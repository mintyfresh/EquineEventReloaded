import { Dropdown } from 'react-bootstrap';
import { deletePlayer, Player } from '../../lib/players';
import EllipsisDropdown from '../EllipsisDropdown';

export interface PlayerListItemProps {
  player: Player;
  onPlayerDelete: (player: Player) => (void | Promise<void>);
}

const PlayerListItem: React.FC<PlayerListItemProps> = ({ player, onPlayerDelete }) => {
  return (
    <>
      {player.name}
      <EllipsisDropdown className="float-end">
        <Dropdown.Item>Mark unpaid</Dropdown.Item>
        <Dropdown.Item>Drop</Dropdown.Item>
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
