import Head from 'next/head';
import { Container } from 'react-bootstrap';
import { Timer } from '../components/Timer';
import type { NextPageWithLayout } from '../types/next-page';

const TimerPage: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Timer - Equine Event Runner</title>
      </Head>
      <Container className="pt-3">
        <Timer />
      </Container>
    </>
  );
}

TimerPage.getLayout = (page) => page;

export default TimerPage;
