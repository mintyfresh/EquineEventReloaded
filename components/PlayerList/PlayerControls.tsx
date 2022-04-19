import { Dropdown } from 'react-bootstrap';
import type { Player } from '../../lib/players';
import EllipsisDropdown from '../EllipsisDropdown';

interface PlayerControlsProps {
  player: Player;
}

const PlayerControls: React.FC<PlayerControlsProps> = ({ player }) => {
  return (
    <EllipsisDropdown className="float-end">
      <Dropdown.Item>Mark unpaid</Dropdown.Item>
      <Dropdown.Item>Drop</Dropdown.Item>
      <Dropdown.Divider />
      <Dropdown.Item className="text-danger">Remove</Dropdown.Item>
    </EllipsisDropdown>
  );
};

export default PlayerControls;
