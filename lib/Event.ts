export interface Event {
  id: string;
  value: {
    _id: string;
    _rev: string;
    type: 'event';
    name: string;
    current_round: number;
    players: string[];
    done: boolean;
    eventType: string;
  };
}
