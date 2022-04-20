import { NextApiHandler } from 'next';
import { Server } from '../../../api/server';
import type { CreateEventResponse, ListEventsResponse } from '../../../api/types';

const handler: NextApiHandler<ListEventsResponse | CreateEventResponse | { error: any }> = async (req, res) => {
  try {
    switch (req.method) {
      case 'GET':
        return res.status(200).json(await Server.listEvents());

      case 'POST':
        return res.status(201).json(await Server.createEvent(req.body.input));

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    res.status(500).json({ error });
  }
};

export default handler;
