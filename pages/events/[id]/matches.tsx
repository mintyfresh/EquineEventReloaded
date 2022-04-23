import type { GetServerSideProps } from 'next';
import { ReactElement, useState } from 'react';
import { Button, ButtonToolbar, Card, Col, Form, Row } from 'react-bootstrap';
import { Client } from '../../../api/client';
import { Server } from '../../../api/server';
import type { Event, Match, UpdateEventMatchInput } from '../../../api/types';
import EventLayout from '../../../components/EventLayout';
import MatchList from '../../../components/MatchList';
import { getRankedPairings } from '../../../lib/rankings';
import type { NextPageWithLayout } from '../../../types/next-page';

export const getServerSideProps: GetServerSideProps<EventMatchesPageProps> = async ({ params }) => {
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

interface EventMatchesPageProps {
  event: Event;
  matches: Match[];
}

const EventMatchesPage: NextPageWithLayout<EventMatchesPageProps> = ({ event: initialEvent, matches: initialMatches }) => {
  const [event, setEvent] = useState(initialEvent);
  const [matches, setMatches] = useState(initialMatches);

  const onMatchUpdate = async (match: Match, input: UpdateEventMatchInput) => {
    const { match: updatedMatch } = await Client.updateEventMatch(event.id, match.id, input);

    setMatches(matches.map((m) => m.id === match.id ? updatedMatch : m));
  };

  const onMatchDelete = async (match: Match) => {
    await Client.deleteEventMatch(event.id, match.id);

    setMatches(matches.filter((m) => m.id !== match.id));
  };

  const pairNextRound = async () => {
    const response = await fetch(`/api/events/${event.id}/matches/next`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });

    const { event: updatedEvent, matches } = await response.json();

    setEvent(updatedEvent);
    setMatches(matches);
  };

  return (
    <>
      <Row className="mb-3">
        <Col xs="auto">
          <Form.Select>
            <option>All</option>
            <option>Current</option>
            <option>Completed</option>
          </Form.Select>
        </Col>
        <Col xs="auto" className="ms-auto">
          <ButtonToolbar className="gap-2">
            <Button variant="outline-secondary" onClick={async () => await pairNextRound()}>Pair Next Round</Button>
            <Button variant="outline-secondary">Pair Current Round</Button>
            <Button variant="outline-secondary">Unpair Last Round</Button>
          </ButtonToolbar>
        </Col>
      </Row>
      <MatchList
        matches={matches}
        onMatchUpdate={onMatchUpdate}
        onMatchDelete={onMatchDelete}
      />
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

EventMatchesPage.getLayout = (page: ReactElement) => {
  const { event } = page.props;

  return (
    <EventLayout event={event}>{page}</EventLayout>
  );
};

export default EventMatchesPage;
