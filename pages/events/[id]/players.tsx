import type { GetServerSideProps } from 'next';
import { ReactElement, useState } from 'react';
import { Card } from 'react-bootstrap';
import EventLayout from '../../../components/EventLayout';
import PlayerCreateForm from '../../../components/PlayerCreateForm';
import PlayerList from '../../../components/PlayerList';
import { addPlayerToEvent, Event, getEvent } from '../../../lib/events';
import { getPlayers, Player } from '../../../lib/players';
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
  players: Player[];
};

const EventPlayersPage: NextPageWithLayout<EventPlayersPageProps> = ({ event: initialEvent, players: initialPlayers }) => {
  const [event, setEvent] = useState(initialEvent);
  const [players, setPlayers] = useState(initialPlayers);

  return (
    <>
      <PlayerCreateForm
        className="mb-3"
        onPlayerCreate={async (player) => {
          const newEvent = await addPlayerToEvent(event._id, player._id);

          setEvent(newEvent);
          setPlayers([...players, player]);
        }}
      />
      <PlayerList players={players} />
      {players.length === 0 && (
        <Card body className="text-center">
          <Card.Text>
            No players yet.
          </Card.Text>
        </Card>
      )}
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
