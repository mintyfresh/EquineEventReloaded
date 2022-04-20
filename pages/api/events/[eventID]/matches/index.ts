import { NextApiHandler } from 'next';
import { Server } from '../../../../../api/server';
import type { ListEventMatchesResponse } from '../../../../../api/types';

const handler: NextApiHandler<ListEventMatchesResponse | { error: any }> = async (req, res) => {
  const eventID = req.query.eventID as string;

  try {
    switch (req.method) {
      case 'GET':
        return res.status(200).json(await Server.listEventMatches(eventID));

      default:
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    res.status(500).json({ error });
  }
};

export default handler;
