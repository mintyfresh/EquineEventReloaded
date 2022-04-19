import type { GetServerSideProps } from 'next';
import { ReactElement } from 'react';
import EventLayout from '../../components/EventLayout';
import type { Event } from '../../lib/Event';
import type { NextPageWithLayout } from '../../types/next-page';

export const getServerSideProps: GetServerSideProps<ShowEventPageProps> = async ({ params }) => {
  if (!params?.id) {
    return {
      notFound: true
    };
  }

  const response = await fetch(`http://localhost:5984/eer/${params.id}`);
  const event = await response.json();

  return {
    props: { event: event }
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
