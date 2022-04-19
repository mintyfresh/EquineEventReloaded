import { sortBy } from 'lodash';
import type { GetServerSideProps } from 'next';
import type { ReactElement } from 'react';
import { Button, ButtonToolbar, Card, Col, Form, Row } from 'react-bootstrap';
import EventLayout from '../../../components/EventLayout';
import MatchList from '../../../components/MatchList';
import { Event, getEvent } from '../../../lib/events';
import { getMatches, Match } from '../../../lib/matches';
import { getPlayers, Player } from '../../../lib/players';
import type { NextPageWithLayout } from '../../../types/next-page';

export const getServerSideProps: GetServerSideProps<EventMatchesPageProps> = async ({ params }) => {
  if (!params?.id) {
    return {
      notFound: true
    };
  }

  const event = await getEvent(params.id as string);
  const players = await getPlayers(event.players);
  const matches = sortBy(await getMatches(event._id), 'table');

  return {
    props: { event, players, matches }
  };
};

interface EventMatchesPageProps {
  event: Event;
  players: Player[];
  matches: Match[];
}

const EventMatchesPage: NextPageWithLayout<EventMatchesPageProps> = ({ players, matches }) => {
  return (
    <>
      <h2>Matches</h2>
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
            <Button variant="outline-secondary">Pair Next Match</Button>
            <Button variant="outline-secondary">Pair Current Match</Button>
            <Button variant="outline-secondary">Unpair Last Round</Button>
          </ButtonToolbar>
        </Col>
      </Row>
      <MatchList players={players} matches={matches} />
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
