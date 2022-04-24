import { deleteBulkMatches } from '../../lib/db/matches';
import { DeleteCurrentRoundResponse } from '../types/round';
import { getEvent, updateEvent } from './event';
import { listEventMatches } from './match';

export const deleteCurrentRound = async (eventID: string): Promise<DeleteCurrentRoundResponse> => {
  const { event } = await getEvent(eventID);
  const { matches } = await listEventMatches(eventID);

  await deleteBulkMatches(matches.map((match) => ({ _id: match.id })));

  const currentRound = Math.max(1, event.currentRound - 1);
  const { event: updatedEvent } = await updateEvent(eventID, { current_round: currentRound });

  return { event: updatedEvent };
};
