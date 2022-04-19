import Head from 'next/head';
import { ReactNode } from 'react';
import { Container } from 'react-bootstrap';
import AppNavbar from './AppNavbar';

const Layout: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <>
      <Head>
        <title>Equine Event Runner</title>
      </Head>
      <AppNavbar className="mb-4" />
      <Container>
        {children}
      </Container>
    </>
  );
};

export default Layout;
