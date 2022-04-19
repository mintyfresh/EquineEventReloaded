import Head from 'next/head';
import type { ReactNode } from 'react';
import type { Event } from '../lib/Event';
import EventNav from './EventNav';
import Layout from './Layout';

const EventLayout: React.FC<{ event: Event, children: ReactNode }> = ({ event, children }) => {
  return (
    <Layout>
      <Head>
        <title>{event.name} - Equine Event Runner</title>
      </Head>
      <h1>{event.name}</h1>
      <EventNav event={event} />
      {children}
    </Layout>
  );
};

export default EventLayout;
