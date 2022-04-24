import { shuffle } from 'lodash';
import { NIL as NIL_UUID } from 'uuid';
import { Server } from '../api/server';
import type { Event, Player } from '../api/types';
import { isLoser, isTie, isWinner, MatchRecord } from './db/matches';
import { PlayerRecord } from './db/players';

export const getPlayerStatistics = (playerID: string, matches: MatchRecord[]): [number, number, number] => {
  // Only consider matches the player is involved in.
  matches = matches.filter((match) =>
    match.players.includes(playerID)
  );

  const wins   = matches.filter((match) => isWinner(match, playerID)).length;
  const losses = matches.filter((match) => isLoser(match, playerID)).length;
  const ties   = matches.filter(isTie).length;

  return [wins, losses, ties];
};

export const calculateOpponentWinPercentage = (playerID: string, matches: MatchRecord[]): number => {
  // Only consider matches the player is involved in.
  const playerMatches = matches.filter((match) =>
    match.players.includes(playerID)
  );

  let totalMatches = 0;
  let totalOpponentsScore = 0;
  
  playerMatches.forEach((match) => {
    if (match.players[1] === null) {
      return;
    }

    const opponent = match.players[1] === playerID ?
      match.players[0] :
      match.players[1];

    const opponentMatches = matches.filter((match) => match.players.includes(opponent));
    const [wins, losses, ties] = getPlayerStatistics(opponent, opponentMatches);

    const opponentPoints = calculatePoints(wins, losses, ties);
    const maximumPossiblePoints = opponentMatches.length * POINTS_FOR_WIN;

    totalOpponentsScore += opponentPoints / maximumPossiblePoints;
    totalMatches += 1;
  });

  if (totalMatches === 0) {
    return 0;
  }

  return totalOpponentsScore / totalMatches;
};

export const POINTS_FOR_WIN  = 3;
export const POINTS_FOR_TIE  = 1;
export const POINTS_FOR_LOSS = 0;

export const calculatePoints = (wins: number, losses: number, ties: number): number => {
  return (wins * POINTS_FOR_WIN) + (losses * POINTS_FOR_LOSS) + (ties * POINTS_FOR_TIE);
};

const PLACEHOLDER_PLAYER: Player = {
  id: `player.${NIL_UUID}`,
  name: 'BYE',
  paid: true,
  dropped: false,
  points: 0,
  wins: 0,
  losses: 0,
  ties: 0,
  opponentWinPercentage: 0
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

export const getRankedPairings = async (event: Event, round: number): Promise<[string, string, number][]> => {
  const players = await getRankedPlayers(event);
  const { matches } = await Server.listEventMatches(event.id);

  const playersToRemove: Set<string> = new Set();
  const playerOpponents: Map<string, Set<string>> = new Map();

  players.forEach((player) => {
    playerOpponents.set(player.id, new Set());
  });

  matches.forEach((match) => {
    let [player1, player2] = match.players;

    // Skip if both players have been deleted.
    if (!player1 && !player2) {
      return;
    };

    // Exclude players already in the current match.
    if (round === match.round) {
      player1 && playersToRemove.add(player1.id);
      player2 && playersToRemove.add(player2.id);
    }

    // Insert a placeholder for deleted players.
    player1 || (player1 = PLACEHOLDER_PLAYER);
    player2 || (player2 = PLACEHOLDER_PLAYER);

    playerOpponents.get(player1.id)?.add(player2.id);
    playerOpponents.get(player2.id)?.add(player1.id);
  });

  const edgeList: [string, string, number][] = [];
  const rankedPlayers = players.filter((player) => !playersToRemove.has(player.id));

  rankedPlayers.forEach((player, playerIndex) => {
    const opponentOffset = playerIndex + 1;

    rankedPlayers.slice(opponentOffset).forEach((opponent, opponentIndex) => {
      let weight = 0;

      if (playerOpponents.get(player.id)?.has(opponent.id)) {
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
