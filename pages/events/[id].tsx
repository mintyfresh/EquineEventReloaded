import type { GetServerSideProps, NextPage } from 'next';
import { Nav } from 'react-bootstrap';
import ActiveLink from '../../components/ActiveLink';
import type { Event } from '../../lib/Event';

export const getServerSideProps: GetServerSideProps<ShowEventPageProps> = async ({ params }) => {
  if (!params?.id) {
    return {
      notFound: true
    };
  }

  const response = await fetch(`http://localhost:5984/eer/${params.id}`);
  const event = await response.json();

  return {
    props: { event: event }
  };
};

interface ShowEventPageProps {
  event: Event;
}

const ShowEventPage: NextPage<ShowEventPageProps> = ({ event }) => {
  return (
    <>
      <h1>{event.name}</h1>
      <Nav variant="tabs" className="mb-3">
        <Nav.Item>
          <ActiveLink href="/events/[id]" as={`/events/${event._id}`} passHref>
            <Nav.Link>Status</Nav.Link>
          </ActiveLink>
        </Nav.Item>
        <Nav.Item>
          <ActiveLink href="/events/[id]/players" as={`/events/${event._id}/players`} passHref>
            <Nav.Link>Players</Nav.Link>
          </ActiveLink>
        </Nav.Item>
        <Nav.Item>
          <ActiveLink href="/events/[id]/matches" as={`/events/${event._id}/matches`} passHref>
            <Nav.Link>Matches</Nav.Link>
          </ActiveLink>
        </Nav.Item>
      </Nav>
      <dl>
        <dt>Type</dt>
        <dd>{event.eventType}</dd>
        <dt>Active</dt>
        <dd>{!event.done ? 'Yes' : 'No'}</dd>
      </dl>
    </>
  );
};

export default ShowEventPage;
