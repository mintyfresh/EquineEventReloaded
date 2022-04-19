import { ListGroup } from 'react-bootstrap';
import type { Match } from '../lib/matches';
import type { Player } from '../lib/players';
import MatchListItem from './MatchList/MatchListItem';
import { sortBy } from 'lodash';

export interface MatchListProps {
  players: Player[];
  matches: Match[];
}

const MatchList: React.FC<MatchListProps> = ({ players, matches }) => { 
  return (
    <ListGroup>
      {matches.map((match) => (
        <ListGroup.Item key={match._id}>
          <MatchListItem match={match} players={players} />
        </ListGroup.Item>
      ))}
    </ListGroup>
  )
};

export default MatchList;