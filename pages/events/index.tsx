import type { GetServerSideProps, NextPage } from 'next';
import { Card } from 'react-bootstrap';
import CreateEventForm from '../../components/CreateEventForm';
import EventList from '../../components/EventList';
import { Event } from '../../lib/Event';

export const getServerSideProps: GetServerSideProps = async () => {
  const response = await fetch('http://localhost:5984/eer/_design/eer/_view/events');
  const { rows } = await response.json();

  return {
    props: { events: rows },
  };
};

const EventsIndexPage: NextPage<{ events: Event[] }> = ({ events }) => {
  return (
    <>
      <h1>Events</h1>
      <CreateEventForm className="mb-3" />
      <EventList events={events} />
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

export default EventsIndexPage;
