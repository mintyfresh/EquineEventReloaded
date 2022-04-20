import { NextApiHandler } from 'next';
import { createEventPlayer, listEventPlayers } from '../../../../../api/server/player';
import type { CreateEventPlayerResponse, ListEventPlayersResponse } from '../../../../../api/types/player';

const handler: NextApiHandler<ListEventPlayersResponse | CreateEventPlayerResponse | { error: any }> = async (req, res) => {
  const eventID = req.query.eventID as string;

  try {
    switch (req.method) {
      case 'GET':
        return res.status(200).json(await listEventPlayers(eventID));

      case 'POST':
        return res.status(201).json(await createEventPlayer(eventID, req.body.input));

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    res.status(500).json({ error });
  }
};

export default handler;
