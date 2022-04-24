import { sortBy } from 'lodash';
import type { GetServerSideProps } from 'next';
import { ReactElement, useState } from 'react';
import { Button, ButtonToolbar, Card, Col, Form, InputGroup, Row } from 'react-bootstrap';
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

const MATCH_STATUS_FILTERS: { [key: string]: (match: Match) => boolean } = {
  'All': (_) => true,
  'Current': (match) => !match.winner,
  'Completed': (match) => !!match.winner
};

const EventMatchesPage: NextPageWithLayout<EventMatchesPageProps> = ({ event: initialEvent, matches: initialMatches }) => {
  const [event, setEvent] = useState(initialEvent);
  const [matches, setMatches] = useState(initialMatches);

  const [statusFilter, setStatusFilter] = useState('All');
  const [roundFilter, setRoundFilter] = useState(matches.reduce((max, match) => Math.max(max, match.round), 0));

  const filteredMatches = matches
    .filter((m) => m.round === roundFilter)
    .filter(MATCH_STATUS_FILTERS[statusFilter]);
  ;

  const onMatchUpdate = async (match: Match, input: UpdateEventMatchInput) => {
    const { match: updatedMatch } = await Client.updateEventMatch(event.id, match.id, input);

    setMatches(matches.map((m) => m.id === match.id ? updatedMatch : m));
  };

  const onMatchDelete = async (match: Match) => {
    await Client.deleteEventMatch(event.id, match.id);

    setMatches(matches.filter((m) => m.id !== match.id));
  };

  const pairNextRound = async () => {
    const { event: updatedEvent, matches: newMatches } = await Client.createNextRound(event.id);

    setEvent(updatedEvent);
    setMatches(sortBy([...newMatches, ...matches], 'round', 'table'));
    setRoundFilter(newMatches[0]?.round || roundFilter);
  };

  const pairCurrentRound = async () => {
    const { event: updatedEvent, matches: newMatches } = await Client.fillInCurrentRound(event.id);

    setEvent(updatedEvent);
    setMatches(sortBy([...newMatches, ...matches], 'round', 'table'));
    setRoundFilter(newMatches[0]?.round || roundFilter);
  };

  const unpairLastRound = async () => {
    await Client.deleteCurrentRound(event.id);

    const { event: updatedEvent } = await Client.getEvent(event.id);
    const { matches: updatedMatches } = await Client.listEventMatches(event.id);

    setEvent(updatedEvent);
    setMatches(updatedMatches);

    const maxRound = updatedMatches.reduce((max, m) => Math.max(max, m.round), 0);
    setRoundFilter(Math.max(1, maxRound));
  };

  return (
    <>
      <Row className="mb-3">
        <Col xs="auto">
          <InputGroup>
            <InputGroup.Text>Status</InputGroup.Text>
            <Form.Select
              title="Status"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.currentTarget.value)}
            >
              {Object.keys(MATCH_STATUS_FILTERS).map((key) => (
                <option key={key} value={key}>{key}</option>
              ))}
            </Form.Select>
          </InputGroup>
        </Col>
        <Col xs="auto">
          <InputGroup>
            <InputGroup.Text>Round</InputGroup.Text>
            <Form.Select
              title="Round"
              value={roundFilter}
              onChange={(event) => setRoundFilter(+event.currentTarget.value)}
            >
              {Array(matches.reduce((max, m) => Math.max(max, m.round), 0)).fill(0).map((_, i) => (
                <option key={i + 1}>{i + 1}</option>
              )).reverse()}
            </Form.Select>
          </InputGroup>
        </Col>
        <Col xs="auto" className="ms-auto">
          <ButtonToolbar className="gap-2">
            <Button variant="outline-secondary" onClick={async () => await pairNextRound()}>Pair Next Round</Button>
            <Button variant="outline-secondary" onClick={async () => await pairCurrentRound()}>Pair Current Round</Button>
            <Button variant="outline-secondary" onClick={async () => await unpairLastRound()}>Unpair Last Round</Button>
          </ButtonToolbar>
        </Col>
      </Row>
      <MatchList
        matches={filteredMatches}
        onMatchUpdate={onMatchUpdate}
        onMatchDelete={onMatchDelete}
      />
      {filteredMatches.length === 0 && (
        <Card body className="text-center">
          <Card.Text>
            {matches.length === 0 ? (
              'No matches yet.'
            ) : (
              'No matches found with the current filters.'
            )}
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
