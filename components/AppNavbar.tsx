import Link from 'next/link';
import { Container, Navbar } from 'react-bootstrap'

interface AppNavbarProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onSelect'> {
}

const AppNavbar: React.FC<AppNavbarProps> = ({ ...props }) => {
  return (
    <Navbar {...props} bg="dark" variant="dark">
      <Container>
        <Link href="/" passHref>
          <Navbar.Brand>Equine Event Runner</Navbar.Brand>
        </Link>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
