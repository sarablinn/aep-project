import { GameResource } from './gameApi';

export interface EventResource {
  eventId: number;
  eventName: string;
  startDate: Date;
  endDate: Date;
  eventCreatorId: number;
  eventGames: GameResource[];
}

export interface EventDto {
  eventName: string;
  startDate: string;
  endDate: string;
  eventCreatorId: number;
}
