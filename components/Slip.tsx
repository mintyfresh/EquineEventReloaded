import type { Event, Match, Player } from '../api/types';

const playerName = (player: Player | null) => (
  player?.name ?? 'None'
);

export interface SlipProps {
  event: Event;
  match: Match;
}

const Slip: React.FC<SlipProps> = ({ event, match }) => {
  return (
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="600px"
         height="129px" viewBox="0 0 540 115" enableBackground="new 0 0 540 115" xmlSpace="preserve">
      <rect x="0.5" y="0.5" fill="none" stroke="#231F20" strokeMiterlimit="10" width="539" height="114"/>
      <text transform="matrix(1 0 0 1 2.999 13.5493)" fontFamily="'MyriadPro-Regular'" fontSize="12">{event.name} - Round {match.round}</text>
      <text transform="matrix(1 0 0 1 216.8911 13.5493)" fontFamily="'MyriadPro-Regular'" fontSize="12">Win</text>
      <text transform="matrix(1 0 0 1 368.0713 13.5493)" fontFamily="'MyriadPro-Regular'" fontSize="12">First</text>
      <text transform="matrix(1 0 0 1 458.9805 13.5493)" fontFamily="'MyriadPro-Regular'" fontSize="12">Drop?</text>
      <text transform="matrix(1 0 0 1 35.5 37.624)" fontFamily="'MyriadPro-Regular'" fontSize="12">{match.players[0]?.points || 0} - {playerName(match.players[0])}</text>
      <text transform="matrix(1 0 0 1 205.6055 37.624)" fontFamily="'MyriadPro-Regular'" fontSize="12">_______</text>
      <text transform="matrix(1 0 0 1 357.5654 37.624)" fontFamily="'MyriadPro-Regular'" fontSize="12">_______</text>
      <text transform="matrix(1 0 0 1 453.0225 37.624)" fontFamily="'MyriadPro-Regular'" fontSize="12">_______</text>
      <text transform="matrix(1 0 0 1 290.3911 13.5493)" fontFamily="'MyriadPro-Regular'" fontSize="12">Tie</text>
      <text transform="matrix(1 0 0 1 281.1055 54.625)" fontFamily="'MyriadPro-Regular'" fontSize="12">_______</text>
      <text transform="matrix(1 0 0 1 35.5 69.1245)" fontFamily="'MyriadPro-Regular'" fontSize="12">{match.players[1]?.points || 0} - {playerName(match.players[1])}</text>
      <text transform="matrix(1 0 0 1 205.6055 69.1245)" fontFamily="'MyriadPro-Regular'" fontSize="12">_______</text>
      <text transform="matrix(1 0 0 1 357.5654 69.1245)" fontFamily="'MyriadPro-Regular'" fontSize="12">_______</text>
      <text transform="matrix(1 0 0 1 453.0225 69.1245)" fontFamily="'MyriadPro-Regular'" fontSize="12">_______</text>
      <text transform="matrix(1 0 0 1 71 103.2485)" fontFamily="'MyriadPro-Regular'" fontSize="12">{playerName(match.players[0])}: _______________________</text>
      <text transform="matrix(1 0 0 1 289 103.2485)" fontFamily="'MyriadPro-Regular'" fontSize="12">{playerName(match.players[1])}: _______________________</text>
      <text transform="matrix(1 0 0 1 2.999 110.0005)" fontFamily="'MyriadPro-Regular'" fontSize="12">{match.table}</text>
    </svg>
  );
};

export default Slip;
