import type { EventRecord } from './events';
import { getMatchesByEvent, isLoser, isTie, isWinner, MatchRecord } from './matches';
import { getPlayers, PlayerRecord } from './players';

export interface RankedPlayer extends PlayerRecord {
  points: number;
}

export const getPlayerStatistics = (matches: MatchRecord[], player: PlayerRecord): [number, number, number] => {
  // Only consider matches the player is involved in.
  matches = matches.filter((match) =>
    match.players.includes(player._id)
  );

  const wins   = matches.filter((match) => isWinner(match, player)).length;
  const losses = matches.filter((match) => isLoser(match, player)).length;
  const ties   = matches.filter(isTie).length;

  return [wins, losses, ties];
};

export const calculatePlayerPoints = (matches: MatchRecord[], player: PlayerRecord): number => {
  const [wins, losses, ties] = getPlayerStatistics(matches, player);

  return (wins * 3) + (losses * 0) + (ties * 1);
};

export const getRankedPlayers = async (event: EventRecord): Promise<RankedPlayer[]> => {
  const players = await getPlayers(event.players);
  const matches = await getMatchesByEvent(event._id);

  const rankedPlayers = players
    .filter((player) => (
      player.paid && !player.dropped
    ))
    .map(async (player) => ({
      ...player,
      points: calculatePlayerPoints(matches, player)
    }));

  return await Promise.all(rankedPlayers);
};
