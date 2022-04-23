import { shuffle } from 'lodash';
import { NIL as NIL_UUID } from 'uuid';
import { Server } from '../api/server';
import type { Event, Player } from '../api/types';
import { isLoser, isTie, isWinner, MatchRecord } from './db/matches';
import { PlayerRecord } from './db/players';

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

export const calculatePoints = (wins: number, losses: number, ties: number): number => {
  return (wins * 3) + (losses * 0) + (ties * 1);
};

export const PLACEHOLDER_PLAYER: Player = {
  id: `player.${NIL_UUID}`,
  name: 'BYE',
  paid: true,
  dropped: false,
  points: 0,
  wins: 0,
  losses: 0,
  ties: 0
};

export const isPlaceholderPlayer = (player: Player | string): boolean => {
  if (typeof player === 'string') {
    return player === PLACEHOLDER_PLAYER.id;
  } else {
    return player.id === PLACEHOLDER_PLAYER.id;
  }
};

const isEligibleForMatch = (player: Player): boolean => {
  return player.paid && !player.dropped;
};

const getRankedPlayers = async (event: Event): Promise<Player[]> => {
  const players = (await Server.listEventPlayers(event.id)).players.filter(isEligibleForMatch);

  // Add a placeholder player if there are an odd number of players.
  if (players.length & 1) {
    players.push(PLACEHOLDER_PLAYER);
  }

  return shuffle(players);
};

export const getRankedPairings = async (event: Event): Promise<[string, string, number][]> => {
  const players = await getRankedPlayers(event);
  const { matches } = await Server.listEventMatches(event.id);

  const playersToRemove: Set<Player> = new Set();
  const playerOpponents: Map<Player, Set<Player>> = new Map();

  players.forEach((player) => {
    playerOpponents.set(player, new Set());
  });

  matches.forEach((match) => {
    let [player1, player2] = match.players;

    // Skip if both players have been deleted.
    if (!player1 && !player2) {
      return;
    };

    // Exclude players already in the current match.
    if (event.currentRound === match.round) {
      player1 && playersToRemove.add(player1);
      player2 && playersToRemove.add(player2);
    }

    // Insert a placeholder for deleted players.
    player1 || (player1 = PLACEHOLDER_PLAYER);
    player2 || (player2 = PLACEHOLDER_PLAYER);

    playerOpponents.get(player1)?.add(player2);
    playerOpponents.get(player2)?.add(player1);
  });

  const edgeList: [string, string, number][] = [];
  const rankedPlayers = players.filter((player) => !playersToRemove.has(player));

  rankedPlayers.forEach((player, playerIndex) => {
    const opponentOffset = playerIndex + 1;

    rankedPlayers.slice(opponentOffset).forEach((opponent, opponentIndex) => {
      let weight = 0;

      if (playerOpponents.get(player)?.has(opponent)) {
        weight = -9_999_999;
      } else {
        const min = Math.min(player.points, opponent.points);
        const max = Math.max(player.points, opponent.points);

        weight = ((max + min) / 2) - (max - min)**2;
      }

      edgeList.push([player.id, opponent.id, weight]);
    });
  });

  return edgeList;
};
