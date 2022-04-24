import { NextApiHandler } from 'next';
import { Server } from '../../../../../api/server';
import { CreateNextRoundResponse } from '../../../../../api/types/round';

const handler: NextApiHandler<CreateNextRoundResponse> = async (req, res) => {
  const eventID = req.query.eventID as string;

  switch (req.method) {
    case 'POST':
      return res.status(201).json(await Server.createNextRound(eventID));

    default:
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default handler;
