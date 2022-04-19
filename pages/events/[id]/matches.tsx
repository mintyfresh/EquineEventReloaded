import type { GetServerSideProps } from 'next';
import type { ReactElement } from 'react';
import EventLayout from '../../../components/EventLayout';
import { Event, getEvent } from '../../../lib/events';
import type { NextPageWithLayout } from '../../../types/next-page';

export const getServerSideProps: GetServerSideProps<EventMatchesPageProps> = async ({ params }) => {
  if (!params?.id) {
    return {
      notFound: true
    };
  }

  return {
    props: { event: await getEvent(params.id as string) }
  };
};

interface EventMatchesPageProps {
  event: Event;
}

const EventMatchesPage: NextPageWithLayout = () => {
  return (
    <></>
  );
};

EventMatchesPage.getLayout = (page: ReactElement) => {
  const { event } = page.props;

  return (
    <EventLayout event={event}>{page}</EventLayout>
  );
};

export default EventMatchesPage;
