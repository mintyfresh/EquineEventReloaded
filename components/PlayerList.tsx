import { faSort, faSortAsc, faSortDesc } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { sortBy } from 'lodash';
import React, { useState } from 'react';
import { Table } from 'react-bootstrap';
import type { Player, UpdateEventPlayerInput } from '../api/types';
import PlayerListItem from './PlayerList/PlayerListItem';

function useSortableColumns<T>(): [
  (values: T[]) => T[],
  React.FC<{ column: keyof T, defaultSortDesc?: boolean, children: React.ReactChild }>
] {
  const [sortByColumn, setSortByColumn] = useState<keyof T | null>(null);
  const [sortByAsc, setSortByAsc] = useState(true);

  return [
    (values: T[]) => {
      if (sortByColumn) {
        values = sortBy(values, sortByColumn);

        if (!sortByAsc) {
          values = values.reverse();
        }
      }

      return values;
    },
    ({ column, defaultSortDesc = false, children }) => (
      <th role="button" onClick={() => {
        if (sortByColumn === column) {
          setSortByAsc(!sortByAsc);
        } else {
          setSortByColumn(column)
          setSortByAsc(!defaultSortDesc);
        }
      }}>
        {sortByColumn === column ? (
          <FontAwesomeIcon icon={sortByAsc ? faSortAsc : faSortDesc} className="me-1" />
        ) : (
          <FontAwesomeIcon icon={faSort} className="me-1" />
        )}
        {children}
      </th>
    )
  ];
}

export interface PlayerListProps {
  players: Player[];
  onPlayerUpdate: (player: Player, input: UpdateEventPlayerInput) => (void | Promise<void>);
  onPlayerDelete: (player: Player) => (void | Promise<void>);
};

const PlayerList: React.FC<PlayerListProps> = ({ players, onPlayerUpdate, onPlayerDelete }) => {
  const [sortPlayers, SortableColumnHeader] = useSortableColumns<Player>();

  return (
    <Table variant="striped">
      <thead>
        <tr>
          <SortableColumnHeader column="name">
            Name
          </SortableColumnHeader>
          <SortableColumnHeader column="wins" defaultSortDesc={true}>
            Wins
          </SortableColumnHeader>
          <SortableColumnHeader column="losses" defaultSortDesc={true}>
            Losses
          </SortableColumnHeader>
          <SortableColumnHeader column="ties" defaultSortDesc={true}>
            Ties
          </SortableColumnHeader>
          <SortableColumnHeader column="points" defaultSortDesc={true}>
            Points
          </SortableColumnHeader>
          <SortableColumnHeader column="opponentWinPercentage" defaultSortDesc={true}>
            Opponent Win %
          </SortableColumnHeader>
          <th className="text-end">Controls</th>
        </tr>
      </thead>
      <tbody>
        {sortPlayers(players).map((player) => (
          <PlayerListItem
            key={player.id}
            player={player}
            onPlayerUpdate={onPlayerUpdate}
            onPlayerDelete={onPlayerDelete}
          />
        ))}
      </tbody>
    </Table>
  );
};

export default PlayerList;
