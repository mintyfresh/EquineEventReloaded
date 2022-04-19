import type { GetServerSideProps } from 'next';
import type { ReactElement } from 'react';
import { Button, ButtonToolbar, Card, Col, Form, Row } from 'react-bootstrap';
import EventLayout from '../../../components/EventLayout';
import { Event, getEvent } from '../../../lib/events';
import type { NextPageWithLayout } from '../../../types/next-page';

export const getServerSideProps: GetServerSideProps<EventMatchesPageProps> = async ({ params }) => {
  if (!params?.id) {
    return {
      notFound: true
    };
  }

  return {
    props: { event: await getEvent(params.id as string) }
  };
};

interface EventMatchesPageProps {
  event: Event;
}

const EventMatchesPage: NextPageWithLayout = () => {
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
      <Card body className="text-center">
        <Card.Text>
          No matches yet.
        </Card.Text>
      </Card>
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
