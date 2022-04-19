import Head from 'next/head';
import type { NextPageWithLayout } from '../types/next-page';

const TimerPage: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Timer - Equine Event Runner</title>
      </Head>
      <h1>Timer</h1>
      TODO
    </>
  );
}

TimerPage.getLayout = (page) => page;

export default TimerPage;
