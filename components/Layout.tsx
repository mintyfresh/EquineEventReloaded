import Head from 'next/head';
import { ReactNode } from 'react';
import { Container } from 'react-bootstrap';

const Layout: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <Container>
      <Head>
        <title>Equine Event Runner</title>
      </Head>
      {children}
    </Container>
  );
};

export default Layout;
