import type { Event } from '../lib/events';
import { getMatchPoints, Match } from '../lib/matches';
import type { Player } from '../lib/players';

export interface SlipProps {
  event: Event;
  players: Player[];
  match: Match;
}

const Slip: React.FC<SlipProps> = ({ event, players, match }) => {
  const player1 = players.find((player) => player._id === match.players[0]);
  const player2 = players.find((player) => player._id === match.players[1]);

  return (
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="600px"
         height="129px" viewBox="0 0 540 115" enable-background="new 0 0 540 115" xmlSpace="preserve">
      <rect x="0.5" y="0.5" fill="none" stroke="#231F20" stroke-miterlimit="10" width="539" height="114"/>
      <text transform="matrix(1 0 0 1 2.999 13.5493)" font-family="'MyriadPro-Regular'" font-size="12">{event.name} - Round {match.round}</text>
      <text transform="matrix(1 0 0 1 216.8911 13.5493)" font-family="'MyriadPro-Regular'" font-size="12">Win</text>
      <text transform="matrix(1 0 0 1 368.0713 13.5493)" font-family="'MyriadPro-Regular'" font-size="12">First</text>
      <text transform="matrix(1 0 0 1 458.9805 13.5493)" font-family="'MyriadPro-Regular'" font-size="12">Drop?</text>
      <text transform="matrix(1 0 0 1 35.5 37.624)" font-family="'MyriadPro-Regular'" font-size="12">{getMatchPoints(event, player1!)} - {player1?.name}</text>
      <text transform="matrix(1 0 0 1 205.6055 37.624)" font-family="'MyriadPro-Regular'" font-size="12">_______</text>
      <text transform="matrix(1 0 0 1 357.5654 37.624)" font-family="'MyriadPro-Regular'" font-size="12">_______</text>
      <text transform="matrix(1 0 0 1 453.0225 37.624)" font-family="'MyriadPro-Regular'" font-size="12">_______</text>
      <text transform="matrix(1 0 0 1 290.3911 13.5493)" font-family="'MyriadPro-Regular'" font-size="12">Tie</text>
      <text transform="matrix(1 0 0 1 281.1055 54.625)" font-family="'MyriadPro-Regular'" font-size="12">_______</text>
      <text transform="matrix(1 0 0 1 35.5 69.1245)" font-family="'MyriadPro-Regular'" font-size="12">{getMatchPoints(event, player2!)} - {player2?.name}</text>
      <text transform="matrix(1 0 0 1 205.6055 69.1245)" font-family="'MyriadPro-Regular'" font-size="12">_______</text>
      <text transform="matrix(1 0 0 1 357.5654 69.1245)" font-family="'MyriadPro-Regular'" font-size="12">_______</text>
      <text transform="matrix(1 0 0 1 453.0225 69.1245)" font-family="'MyriadPro-Regular'" font-size="12">_______</text>
      <text transform="matrix(1 0 0 1 71 103.2485)" font-family="'MyriadPro-Regular'" font-size="12">{player1?.name}: _______________________</text>
      <text transform="matrix(1 0 0 1 289 103.2485)" font-family="'MyriadPro-Regular'" font-size="12">{player2?.name}: _______________________</text>
      <text transform="matrix(1 0 0 1 2.999 110.0005)" font-family="'MyriadPro-Regular'" font-size="12">{match.table}</text>
    </svg>
  );
};

export default Slip;
