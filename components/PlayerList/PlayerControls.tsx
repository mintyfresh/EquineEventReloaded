import { forwardRef } from 'react';
import { Dropdown } from 'react-bootstrap';
import { FaEllipsisH } from 'react-icons/fa';
import type { Player } from '../../lib/players';

const EllipsisToggle = forwardRef<HTMLAnchorElement, { onClick: (event: any) => void }>(({ onClick }, ref) => (
  <a className="text-secondary" href="#" ref={ref} onClick={(event) => {
    event.preventDefault();
    onClick(event);
  }}>
    <FaEllipsisH />
  </a>
));

interface PlayerControlsProps {
  player: Player;
}

const PlayerControls: React.FC<PlayerControlsProps> = ({ player }) => {
  return (
    <Dropdown className="float-end">
      <Dropdown.Toggle as={EllipsisToggle} />
      <Dropdown.Menu>
        <Dropdown.Item>Mark unpaid</Dropdown.Item>
        <Dropdown.Item>Drop</Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item className="text-danger">Remove</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default PlayerControls;
