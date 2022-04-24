import type { DeleteCurrentRoundResponse } from '../types/round';

export const deleteCurrentRound = async (eventID: string): Promise<DeleteCurrentRoundResponse> => {
  const response = await fetch(`/api/events/${eventID}/rounds/current`, {
    method: 'DELETE'
  });

  return await response.json();
};
