import type { GetServerSideProps, NextPage } from 'next';
import { useState } from 'react';
import { Card } from 'react-bootstrap';
import EventCreateForm from '../../components/EventCreateForm';
import EventList from '../../components/EventList';
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

  return (
    <>
      <h1>Events</h1>
      <EventCreateForm
        className="mb-3"
        onEventCreate={(event) => {
          setEvents([...events, event]);
        }}
      />
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
    </>
  );
};

export default IndexEventsPage;
