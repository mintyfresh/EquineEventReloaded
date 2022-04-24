import type { CreateNextRoundResponse, DeleteCurrentRoundResponse, FillInCurrentRoundResponse } from '../types/round';

export const createNextRound = async (eventID: string): Promise<CreateNextRoundResponse> => {
  const response = await fetch(`/api/events/${eventID}/rounds/next`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });

  return response.json();
};

export const fillInCurrentRound = async (eventID: string): Promise<FillInCurrentRoundResponse> => {
  const response = await fetch(`/api/events/${eventID}/rounds/current`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
  });

  return response.json();
};

export const deleteCurrentRound = async (eventID: string): Promise<DeleteCurrentRoundResponse> => {
  const response = await fetch(`/api/events/${eventID}/rounds/current`, {
    method: 'DELETE'
  });

  return response.json();
};
