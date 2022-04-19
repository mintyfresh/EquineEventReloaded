import type { GetServerSideProps } from 'next';
import type { ReactElement } from 'react';
import { ListGroup } from 'react-bootstrap';
import CreatePlayerForm from '../../../components/CreatePlayerForm';
import EventLayout from '../../../components/EventLayout';
import { Event, getEvent } from '../../../lib/events';
import { getPlayers, PlayerCursor } from '../../../lib/players';
import type { NextPageWithLayout } from '../../../types/next-page';

export const getServerSideProps: GetServerSideProps<EventPlayersPageProps> = async ({ params }) => {
  if (!params?.id) {
    return {
      notFound: true
    };
  }

  const event = await getEvent(params.id as string);
  const players = await getPlayers(event.players);

  return {
    props: { event, players }
  };
};

interface EventPlayersPageProps {
  event: Event;
  players: PlayerCursor[];
};

const EventPlayersPage: NextPageWithLayout<EventPlayersPageProps> = ({ players }) => {
  return (
    <>
      <CreatePlayerForm className="mb-3" />
      <ListGroup>
        {players.map((player) => (
          <ListGroup.Item key={player.id}>
            {player.value.name}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </>
  );
};

EventPlayersPage.getLayout = (page: ReactElement) => {
  const { event } = page.props;

  return (
    <EventLayout event={event}>{page}</EventLayout>
  );
};

export default EventPlayersPage;
