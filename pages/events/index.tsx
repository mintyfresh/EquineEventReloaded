import type { GetServerSideProps, NextPage } from 'next';
import { Card } from 'react-bootstrap';
import CreateEventForm from '../../components/CreateEventForm';
import EventList from '../../components/EventList';
import { EventCursor, listEvents } from '../../lib/events';

export const getServerSideProps: GetServerSideProps<IndexEventsPageProps> = async () => {
  return {
    props: { events: await listEvents() },
  };
};

interface IndexEventsPageProps {
  events: EventCursor[];
}

const IndexEventsPage: NextPage<IndexEventsPageProps> = ({ events }) => {
  return (
    <>
      <h1>Events</h1>
      <CreateEventForm className="mb-3" />
      <EventList events={events.map((event) => event.value)} />
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
