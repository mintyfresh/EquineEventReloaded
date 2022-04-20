import type { GetServerSideProps, NextPage } from 'next';
import { useState } from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';
import EventCreateForm from '../../components/EventCreateForm';
import EventList from '../../components/EventList';
import EventMergeModal from '../../components/EventMergeModal';
import { Event, listEvents } from '../../lib/events';

export const getServerSideProps: GetServerSideProps<IndexEventsPageProps> = async () => {
  return {
    props: { events: await listEvents() },
  };
};

interface IndexEventsPageProps {
  events: Event[];
}

const IndexEventsPage: NextPage<IndexEventsPageProps> = ({ events: initialEvents }) => {
  const [events, setEvents] = useState(initialEvents);
  const [showMergeModal, setShowMergeModal] = useState(false);

  return (
    <>
      <h1>Events</h1>
      <Row>
        <Col xs="auto">
          <EventCreateForm
            className="mb-3"
            onEventCreate={(event) => {
              setEvents([...events, event]);
            }}
          />
        </Col>
        <Col xs="auto" className="ms-auto">
          <Button variant="outline-secondary" onClick={() => setShowMergeModal(true)} className="float-end">
            Merge Events
          </Button>
        </Col>
      </Row>
      <EventList
        events={events}
        onEventDelete={(event) => {
          setEvents(events.filter((e) => e._id !== event._id));
        }}
      />
      {events.length === 0 && (
        <Card body className="text-center">
          <Card.Text>
            No events yet.
          </Card.Text>
        </Card>
      )}
      <EventMergeModal
        events={events}
        onEventsMerge={(newEvent) => {
          setShowMergeModal(false);
          setEvents([...events, newEvent]);
        }}
        show={showMergeModal}
        onHide={() => setShowMergeModal(false)}
      />
    </>
  );
};

export default IndexEventsPage;
