import { createBulkMatches, CreateMatchInput, deleteBulkMatches } from '../../lib/db/matches';
import { getRankedPairings } from '../../lib/rankings';
import { Event, Player, serializeMatchRecord } from '../types';
import type { CreateNextRoundResponse, DeleteCurrentRoundResponse, FillInCurrentRoundResponse } from '../types/round';
import { getEvent, updateEvent } from './event';
import { listEventMatches } from './match';
import { listEventPlayers } from './player';

const PAIRING_HOST = process.env.NEXT_PUBLIC_PAIRING_HOST;
const PAIRING_PORT = process.env.NEXT_PUBLIC_PAIRING_PORT;

const buildMatchInputsForRound = async (event: Event, round: number, players: Player[]): Promise<CreateMatchInput[]> => {
  const pairings = await getRankedPairings(event, round);
  const response = await fetch(`http://${PAIRING_HOST}:${PAIRING_PORT}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(pairings)
  });

  const matchedPairings: [string, string][] = await response.json();

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
      event: event.id,
      round,
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

  return matchInputs;
};

const getAllocatedTables = async (event: Event, round: number): Promise<Set<number>> => {
  const tables: Set<number> = new Set();
  const { matches } = await listEventMatches(event.id);

  matches.forEach((match) => {
    if (match.round === round) {
      tables.add(match.table);
    }
  });

  return tables;
};

export const createNextRound = async (eventID: string): Promise<CreateNextRoundResponse> => {
  const { event } = await getEvent(eventID);
  const { players } = await listEventPlayers(event.id);
  const matchInputs = await buildMatchInputsForRound(event, event.currentRound, players);

  matchInputs.forEach((match, index) => {
    match.table = index + 1;
  });

  const matches = await createBulkMatches(matchInputs);
  const { event: updatedEvent } = await updateEvent(eventID, { current_round: event.currentRound + 1 });

  return {
    event: updatedEvent,
    matches: matches.map((match) =>
      serializeMatchRecord(match, players)
    )
  };
};

export const fillInCurrentRound = async (eventID: string): Promise<FillInCurrentRoundResponse> => {
  const { event } = await getEvent(eventID);
  const { players } = await listEventPlayers(event.id);

  const round = Math.max(1, event.currentRound - 1);
  const matchInputs = await buildMatchInputsForRound(event, round, players);
  const tables = await getAllocatedTables(event, round);

  let i = 1, j = 0;
  while (j < matchInputs.length) {
    if (!tables.has(i)) {
      matchInputs[j++].table = i;
    }
    i++;
  }

  const matches = await createBulkMatches(matchInputs);

  return {
    event,
    matches: matches.map((match) =>
      serializeMatchRecord(match, players)
    )
  };
};

export const deleteCurrentRound = async (eventID: string): Promise<DeleteCurrentRoundResponse> => {
  const { event } = await getEvent(eventID);
  const { matches } = await listEventMatches(eventID);

  const currentRound = matches.reduce((max, m) => Math.max(max, m.round), 0);
  const currentMatches = matches.filter((m) => m.round === currentRound);

  await deleteBulkMatches(currentMatches.map((match) => ({ _id: match.id })));

  const newCurrentRound = Math.max(1, currentRound);
  const { event: updatedEvent } = await updateEvent(eventID, { current_round: newCurrentRound });

  return { event: updatedEvent };
};
