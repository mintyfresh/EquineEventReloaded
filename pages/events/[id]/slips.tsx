import type { GetServerSideProps } from 'next';
import type { ReactElement } from 'react';
import { Card } from 'react-bootstrap';
import EventLayout from '../../../components/EventLayout';
import Slip from '../../../components/Slip';
import { Event, getEvent } from '../../../lib/events';
import { getMatches, Match } from '../../../lib/matches';
import { getPlayers, Player } from '../../../lib/players';
import type { NextPageWithLayout } from '../../../types/next-page';

export const getServerSideProps: GetServerSideProps<EventSlipsPageProps> = async ({ params }) => {
  if (!params?.id) {
    return {
      notFound: true
    };
  }

  const event = await getEvent(params.id as string);
  const players = await getPlayers(event.players);
  const matches = await getMatches(event._id);

  return {
    props: { event, players, matches }
  };
};

interface EventSlipsPageProps {
  event: Event;
  players: Player[];
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
          players={players}
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
