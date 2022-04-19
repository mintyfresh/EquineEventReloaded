import type { GetServerSideProps, NextPage } from 'next';
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
