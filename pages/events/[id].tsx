import type { GetServerSideProps } from 'next';
import type { ReactElement } from 'react';
import EventLayout from '../../components/EventLayout';
import { Event, getEvent } from '../../lib/events';
import type { NextPageWithLayout } from '../../types/next-page';

export const getServerSideProps: GetServerSideProps<ShowEventPageProps> = async ({ params }) => {
  if (!params?.id) {
    return {
      notFound: true
    };
  }

  return {
    props: { event: await getEvent(params.id as string) }
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
        <dd>{event.eventType}</dd>
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
