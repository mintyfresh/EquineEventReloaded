import { NextApiHandler } from 'next';
import { Server } from '../../../../../api/server';
import { serializeMatchRecord } from '../../../../../api/types';
import { createBulkMatches, CreateMatchInput } from '../../../../../lib/db/matches';
import { getRankedPairings } from '../../../../../lib/rankings';

const handler: NextApiHandler = async (req, res) => {
  const eventID = req.query.eventID as string;

  switch (req.method) {
    case 'POST':
      const { event } = await Server.getEvent(eventID);

      const pairings = await getRankedPairings(event);
      const response = await fetch('http://localhost:8156', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pairings)
      });

      const matchedPairings: [string, string][] = await response.json();
      const { players } = await Server.listEventPlayers(eventID);

      const matchInputs: CreateMatchInput[] = [];
      matchedPairings.forEach(([p1ID, p2ID]) => {
        let player1 = players.find((p) => p.id === p1ID) ?? null;
        let player2 = players.find((p) => p.id === p2ID) ?? null;

        // Skip if both players are absent.
        if (!player1 && !player2) {
          return;
        }

        if (!player1) {
          [player1, player2] = [player2!, player1];
        }

        matchInputs.push({
          event: eventID,
          round: event.currentRound,
          players: [player1.id, player2?.id || null],
          winner: player2 === null ? player1.id : null, 
        });
      });

      matchInputs.sort((a, b) => {
        if (a.players![1] === null)
          return 1;
        if (b.players![1] === null)
          return -1;
        if (a.rank?.[0] !== b.rank?.[0])
          return (b.rank?.[0] || 0) - (a.rank?.[0] || 0);
        if (a.rank?.[1] !== b.rank?.[1])
          return (b.rank?.[1] || 0) - (a.rank?.[1] || 0);

        return a.players![0].localeCompare(b.players![0]);
      });

      matchInputs.forEach((match, index) => {
        match.table = index;
      });

      const matches = await createBulkMatches(matchInputs);
      const { event: updatedEvent } = await Server.updateEvent(eventID, { current_round: event.currentRound + 1 });

      return res.status(200).json({
        event: updatedEvent,
        matches: matches.map((match) =>
          serializeMatchRecord(match, players)
        )
      });

    default:
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default handler;
