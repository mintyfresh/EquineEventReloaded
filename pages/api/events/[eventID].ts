import { NextApiHandler } from 'next';
import { Server } from '../../../api/server';
import type { DeleteEventResponse, GetEventResponse } from '../../../api/types';

const handler: NextApiHandler<GetEventResponse | DeleteEventResponse | { error: any }> = async (req, res) => {
  const eventID = req.query.eventID as string;

  try {
    switch (req.method) {
      case 'GET':
        return res.status(200).json(await Server.getEvent(eventID));

      case 'PUT':
      case 'PATCH':

      case 'DELETE':
        return res.status(200).json(await Server.deleteEvent(eventID));

      default:
        res.setHeader('Allow', ['GET', 'PUT', 'PATCH', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    res.status(500).json({ error });
  }
};

export default handler;
