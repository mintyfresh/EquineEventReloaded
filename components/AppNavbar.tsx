import Link from 'next/link';
import { Container, Nav, Navbar } from 'react-bootstrap';
import ActiveLink from './ActiveLink';

interface AppNavbarProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onSelect'> {
}

const AppNavbar: React.FC<AppNavbarProps> = ({ ...props }) => {
  const showTimer = () => {
    window.open('/timer', 'Round Timer', 'menubar=no,toolbar=no,scrollbars=no,status=no,directories=no,location=no');
  };

  return (
    <Navbar {...props} bg="dark" variant="dark">
      <Container>
        <Link href="/" passHref>
          <Navbar.Brand>Equine Event Runner</Navbar.Brand>
        </Link>
        <Navbar.Toggle aria-controls="app-navbar-nav" />
        <Navbar.Collapse id="app-navbar-nav">
          <Nav className="mr-auto">
            <ActiveLink href="/events" passHref>
              <Nav.Link>Events</Nav.Link>
            </ActiveLink>
            <Nav.Link onClick={() => showTimer()}>Timer</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
