import { NextApiHandler } from 'next';
import { Server } from '../../../../../api/server';
import type { DeleteCurrentRoundResponse, FillInCurrentRoundResponse } from '../../../../../api/types/round';

const handler: NextApiHandler<FillInCurrentRoundResponse | DeleteCurrentRoundResponse> = async (req, res) => {
  const eventID = req.query.eventID as string;

  switch (req.method) {
    case 'PATCH':
      return res.status(200).json(await Server.fillInCurrentRound(eventID));

    case 'DELETE':
      return res.status(200).json(await Server.deleteCurrentRound(eventID));

    default:
      res.setHeader('Allow', ['PATCH', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default handler;
