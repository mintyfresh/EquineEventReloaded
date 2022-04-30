import { NextApiHandler } from 'next';
import { deleteEventPlayer, getEventPlayer, updateEventPlayer } from '../../../../../api/server';
import type { DeleteEventPlayerResponse, GetEventPlayerResponse, UpdateEventPlayerResponse } from '../../../../../api/types';

const handler: NextApiHandler<GetEventPlayerResponse | UpdateEventPlayerResponse | DeleteEventPlayerResponse | { error: any }> = async (req, res) => {
  const eventID = req.query.eventID as string;
  const playerID = req.query.playerID as string;

  try {
    switch (req.method) {
      case 'GET':
        return res.status(200).json(await getEventPlayer(eventID, playerID));

      case 'PUT':
      case 'PATCH':
        return res.status(200).json(await updateEventPlayer(eventID, playerID, req.body.input));
      
      case 'DELETE':
        return res.status(200).json(await deleteEventPlayer(eventID, playerID));

      default:
        res.setHeader('Allow', ['GET', 'PUT', 'PATCH', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    res.status(500).json({ error });
  }
};

export default handler;
