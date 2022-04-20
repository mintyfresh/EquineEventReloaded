import type { GetServerSideProps, NextPage } from 'next';
import { useState } from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';
import { Client } from '../../api/client';
import { Server } from '../../api/server';
import type { CreateEventInput, Event } from '../../api/types';
import EventCreateForm from '../../components/EventCreateForm';
import EventList from '../../components/EventList';
import EventMergeModal from '../../components/EventMergeModal';

export const getServerSideProps: GetServerSideProps<IndexEventsPageProps> = async () => {
  return {
    props: await Server.listEvents(),
  };
};

interface IndexEventsPageProps {
  events: Event[];
}

const IndexEventsPage: NextPage<IndexEventsPageProps> = ({ events: initialEvents }) => {
  const [events, setEvents] = useState(initialEvents);
  const [showMergeModal, setShowMergeModal] = useState(false);

  const onEventCreate = async (input: CreateEventInput) => {
    const { event } = await Client.createEvent(input);

    setEvents([...events, event]);
  };

  const onEventDelete = async (event: Event) => {
    await Client.deleteEvent(event.id);

    setEvents(events.filter((e) => e.id !== event.id));
  };

  return (
    <>
      <h1>Events</h1>
      <Row>
        <Col xs="auto">
          <EventCreateForm
            className="mb-3"
            onEventCreate={onEventCreate}
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
        onEventDelete={onEventDelete}
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
          // setEvents([...events, newEvent]);
        }}
        show={showMergeModal}
        onHide={() => setShowMergeModal(false)}
      />
    </>
  );
};

export default IndexEventsPage;
