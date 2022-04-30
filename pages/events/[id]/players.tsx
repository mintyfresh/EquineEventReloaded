import type { GetServerSideProps } from 'next';
import { ReactElement, useState } from 'react';
import { Card } from 'react-bootstrap';
import { Client } from '../../../api/client';
import { listEventPlayers } from '../../../api/server';
import type { Event, Player, UpdateEventPlayerInput } from '../../../api/types';
import EventLayout from '../../../components/EventLayout';
import PlayerCreateForm from '../../../components/PlayerCreateForm';
import PlayerList from '../../../components/PlayerList';
import type { CreatePlayerInput } from '../../../lib/db/players';
import type { NextPageWithLayout } from '../../../types/next-page';

export const getServerSideProps: GetServerSideProps<EventPlayersPageProps> = async ({ params }) => {
  if (!params?.id) {
    return {
      notFound: true
    };
  }

  return {
    props: await listEventPlayers(params.id as string)
  };
};

interface EventPlayersPageProps {
  event: Event;
  players: Player[];
};

const EventPlayersPage: NextPageWithLayout<EventPlayersPageProps> = ({ event: initialEvent, players: initialPlayers }) => {
  const [event, setEvent] = useState(initialEvent);
  const [players, setPlayers] = useState(initialPlayers);

  const onPlayerCreate = async (input: CreatePlayerInput) => {
    const { event: updatedEvent, player } = await Client.createEventPlayer(event.id, input)

    setEvent(updatedEvent);
    setPlayers([...players, player]);
  };

  const onPlayerUpdate = async (player: Player, input: UpdateEventPlayerInput) => {
    const { event: updatedEvent, player: updatedPlayer } = await Client.updateEventPlayer(event.id, player.id, input);

    setEvent(updatedEvent);
    setPlayers(players.map((p) => p.id === updatedPlayer.id ? updatedPlayer : p));
  };

  const onPlayerDelete = async (player: Player) => {
    const { event: updatedEvent } = await Client.deleteEventPlayer(event.id, player.id);
          
    setEvent(updatedEvent);
    setPlayers(players.filter((p) => p.id !== player.id));
  };

  return (
    <>
      <PlayerCreateForm
        className="mb-3"
        onPlayerCreate={onPlayerCreate}
      />
      <PlayerList
        players={players}
        onPlayerUpdate={onPlayerUpdate}
        onPlayerDelete={onPlayerDelete}
      />
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
