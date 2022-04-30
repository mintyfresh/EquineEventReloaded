import { NextApiHandler } from 'next';
import { deleteEventMatch, updateEventMatch } from '../../../../../api/server';
import type { DeleteEventMatchResponse, UpdateEventMatchResponse } from '../../../../../api/types';

const handler: NextApiHandler<UpdateEventMatchResponse | DeleteEventMatchResponse | { error: any }> = async (req, res) => {
  const eventID = req.query.eventID as string;
  const matchID = req.query.matchID as string;

  try {
    switch (req.method) {
      case 'PUT':
      case 'PATCH':
        return res.status(200).json(await updateEventMatch(eventID, matchID, req.body.input));

      case 'DELETE':
        return res.status(200).json(await deleteEventMatch(eventID, matchID));

      default:
        res.setHeader('Allow', ['PUT', 'PATCH', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    res.status(500).json({ error });
  }
};

export default handler;
