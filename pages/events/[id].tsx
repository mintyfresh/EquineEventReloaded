import type { GetServerSideProps } from 'next';
import type { ReactElement } from 'react';
import { Server } from '../../api/server';
import type { Event } from '../../api/types';
import EventLayout from '../../components/EventLayout';
import type { NextPageWithLayout } from '../../types/next-page';

export const getServerSideProps: GetServerSideProps<ShowEventPageProps> = async ({ params }) => {
  if (!params?.id) {
    return {
      notFound: true
    };
  }

  return {
    props: await Server.getEvent(params.id as string)
  };
};

interface ShowEventPageProps {
  event: Event;
}

const ShowEventPage: NextPageWithLayout<ShowEventPageProps> = ({ event }) => {
  return (
    <>
      <dl>
        <dt>Type</dt>
        <dd>Swiss</dd>
        <dt>Active</dt>
        <dd>{!event.done ? 'Yes' : 'No'}</dd>
      </dl>
    </>
  );
};

ShowEventPage.getLayout = (page: ReactElement) => {
  const { event } = page.props;

  return (
    <EventLayout event={event}>{page}</EventLayout>
  );
};

export default ShowEventPage;
