import { ListGroup } from 'react-bootstrap';
import type { Match } from '../lib/matches';
import type { Player } from '../lib/players';
import MatchListItem from './MatchList/MatchListItem';

export interface MatchListProps {
  players: Player[];
  matches: Match[];
  onMatchUpdate: (match: Match) => (void | Promise<void>);
}

const MatchList: React.FC<MatchListProps> = ({ players, matches, onMatchUpdate }) => { 
  return (
    <ListGroup>
      {matches.map((match) => (
        <ListGroup.Item key={match._id}>
          <MatchListItem
            match={match}
            players={players}
            onMatchUpdate={onMatchUpdate}
          />
        </ListGroup.Item>
      ))}
    </ListGroup>
  )
};

export default MatchList;
