import type { Event } from './events';
import { getMatches, Match } from './matches';
import { getPlayers, Player } from './players';

export interface RankedPlayer extends Player {
  points: number;
}

export const getWinLossTie = async (event: Event, player: Player, matches?: Match[]): Promise<[number, number, number]> => {
  if (!matches) {
    matches = await getMatches(event._id);
  }

  matches = matches.filter((match) =>
    match.players.includes(player._id)
  );

  const wins = matches.filter((match) =>
    match.winner === player._id
  ).length;

  const losses = matches.filter((match) =>
    !!match.winner && match.winner !== player._id && match.winner !== 'tie'
  ).length;

  const ties = matches.filter((match) =>
    match.winner === 'tie'
  ).length;

  return [wins, losses, ties];
};

export const getMatchPoints = async (event: Event, player: Player, matches?: Match[]): Promise<number> => {
  const [wins, losses, ties] = await getWinLossTie(event, player, matches);

  return (wins * 3) + (losses * 0) + (ties * 1);
};

export const getRankedPlayers = async (event: Event): Promise<RankedPlayer[]> => {
  const players = await getPlayers(event.players);
  const matches = await getMatches(event._id);

  const rankedPlayers = players
    .filter((player) => (
      player.paid && !player.dropped
    ))
    .map(async (player) => ({
      ...player,
      points: await getMatchPoints(event, player, matches)
    }));

  return await Promise.all(rankedPlayers);
};
