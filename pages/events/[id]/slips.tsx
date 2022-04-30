import type { GetServerSideProps } from 'next';
import type { ReactElement } from 'react';
import { Card } from 'react-bootstrap';
import { getEvent, listEventMatches } from '../../../api/server';
import type { Event, Match } from '../../../api/types';
import EventLayout from '../../../components/EventLayout';
import Slip from '../../../components/Slip';
import type { NextPageWithLayout } from '../../../types/next-page';

export const getServerSideProps: GetServerSideProps<EventSlipsPageProps> = async ({ params }) => {
  if (!params?.id) {
    return {
      notFound: true
    };
  }

  const { event } = await getEvent(params.id as string);
  const { matches } = await listEventMatches(params.id as string);
  const currentRound = matches.reduce((max, m) => Math.max(max, m.round), 0);

  return {
    props: {
      event,
      matches: matches.filter((match) => match.round === currentRound)
    }
  };
};

interface EventSlipsPageProps {
  event: Event;
  matches: Match[];
}

const EventSlipsPage: NextPageWithLayout<EventSlipsPageProps> = ({ event, matches }) => {
  return (
    <>
      <h2>Slips</h2>
      {matches.map((match) => (
        <Slip
          key={match.id}
          event={event}
          match={match}
        />
      ))}
      {matches.length === 0 && (
        <Card body className="text-center">
          <Card.Text>
            No matches yet.
          </Card.Text>
        </Card>
      )}
    </>
  );
};

EventSlipsPage.getLayout = (page: ReactElement) => {
  const { event } = page.props;

  return (
    <EventLayout event={event}>{page}</EventLayout>
  );
};

export default EventSlipsPage;
