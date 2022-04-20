import { sortBy } from 'lodash';
import type { GetServerSideProps } from 'next';
import type { ReactElement } from 'react';
import { Card } from 'react-bootstrap';
import { Server } from '../../../api/server';
import { Event, Match } from '../../../api/types';
import EventLayout from '../../../components/EventLayout';
import Slip from '../../../components/Slip';
import { EventRecord, getEvent } from '../../../lib/db/events';
import { getMatchesByEvent, MatchRecord } from '../../../lib/db/matches';
import { getRankedPlayers, RankedPlayer } from '../../../lib/db/rankings';
import type { NextPageWithLayout } from '../../../types/next-page';

export const getServerSideProps: GetServerSideProps<EventSlipsPageProps> = async ({ params }) => {
  if (!params?.id) {
    return {
      notFound: true
    };
  }

  const { event } = await Server.getEvent(params.id as string);
  const { matches } = await Server.listEventMatches(params.id as string);

  return {
    props: { event, matches }
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
