import type { MatchRecord } from '../../lib/db/matches';
import type { PlayerRecord } from '../../lib/db/players';
import { calculateOpponentWinPercentage, calculatePoints, getPlayerStatistics } from '../../lib/rankings';
import type { Event } from './event';

export interface Player {
  id: string;
  name: string;
  paid: boolean;
  dropped: boolean;
  points: number;
  wins: number;
  losses: number;
  ties: number;
  opponentWinPercentage: number;
}

export interface ListEventPlayersResponse {
  event: Event;
  players: Player[];
}

export interface GetEventPlayerResponse {
  event: Event;
  player: Player;
}

export type CreateEventPlayerInput = Pick<Player, 'name' | 'paid'>;

export interface CreateEventPlayerResponse {
  event: Event;
  player: Player;
}

export type UpdateEventPlayerInput = Partial<Pick<Player, 'name' | 'paid' | 'dropped'>>;

export interface UpdateEventPlayerResponse {
  event: Event;
  player: Player;
}

export interface DeleteEventPlayerResponse {
  event: Event;
}

export const serializePlayerRecord = (player: PlayerRecord, matches: MatchRecord[]): Player => {
  const [wins, losses, ties] = getPlayerStatistics(player._id, matches);
  const points = calculatePoints(wins, losses, ties);
  const opponentWinPercentage = calculateOpponentWinPercentage(player._id, matches);

  return {
    id: player._id,
    name: player.name,
    paid: player.paid,
    dropped: player.dropped ?? false,
    points,
    wins,
    losses,
    ties,
    opponentWinPercentage
  };
};
