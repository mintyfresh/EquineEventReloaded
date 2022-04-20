import { ListGroup } from 'react-bootstrap';
import type { Match, Player, UpdateEventMatchInput } from '../api/types';
import MatchListItem from './MatchList/MatchListItem';

export interface MatchListProps {
  matches: Match[];
  onMatchUpdate: (match: Match, input: UpdateEventMatchInput) => (void | Promise<void>);
  onMatchDelete: (match: Match) => (void | Promise<void>);
}

const MatchList: React.FC<MatchListProps> = ({ matches, onMatchUpdate, onMatchDelete }) => { 
  return (
    <ListGroup>
      {matches.map((match) => (
        <ListGroup.Item key={match.id}>
          <MatchListItem
            match={match}
            onMatchUpdate={onMatchUpdate}
            onMatchDelete={onMatchDelete}
          />
        </ListGroup.Item>
      ))}
    </ListGroup>
  )
};

export default MatchList;
