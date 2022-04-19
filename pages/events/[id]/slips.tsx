import { sortBy } from 'lodash';
import type { GetServerSideProps } from 'next';
import type { ReactElement } from 'react';
import { Card } from 'react-bootstrap';
import EventLayout from '../../../components/EventLayout';
import Slip from '../../../components/Slip';
import { Event, getEvent } from '../../../lib/events';
import { getMatches, Match } from '../../../lib/matches';
import { getRankedPlayers, RankedPlayer } from '../../../lib/rankings';
import type { NextPageWithLayout } from '../../../types/next-page';

export const getServerSideProps: GetServerSideProps<EventSlipsPageProps> = async ({ params }) => {
  if (!params?.id) {
    return {
      notFound: true
    };
  }

  const event = await getEvent(params.id as string);
  const players = await getRankedPlayers(event);
  const matches = sortBy(await getMatches(event._id), 'table');

  return {
    props: { event, players, matches }
  };
};

interface EventSlipsPageProps {
  event: Event;
  players: RankedPlayer[];
  matches: Match[];
}

const EventSlipsPage: NextPageWithLayout<EventSlipsPageProps> = ({ event, players, matches }) => {
  return (
    <>
      <h2>Slips</h2>
      {matches.map((match) => (
        <Slip
          key={match._id}
          event={event}
          players={players.filter((player) => match.players.includes(player._id))}
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
