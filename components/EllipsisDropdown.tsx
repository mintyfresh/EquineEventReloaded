import { faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { forwardRef } from 'react';
import { Dropdown } from 'react-bootstrap';

const EllipsisToggle = forwardRef<HTMLAnchorElement, { onClick: (event: any) => void }>(({ onClick }, ref) => (
  <a className="text-secondary" href="#" ref={ref} onClick={(event) => {
    event.preventDefault();
    onClick(event);
  }}>
    <FontAwesomeIcon icon={faEllipsisH} />
  </a>
));

EllipsisToggle.displayName = 'EllipsisToggle';

export interface EllipsisDropdownProps extends React.ComponentPropsWithoutRef<typeof Dropdown> {
  children: React.ReactNode;
}

const EllipsisDropdown: React.FC<EllipsisDropdownProps> = ({ children, ...props }) => {
  return (
    <Dropdown {...props}>
      <Dropdown.Toggle as={EllipsisToggle} />
      <Dropdown.Menu>
        {children}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default EllipsisDropdown;
