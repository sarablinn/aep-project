import { GameResource } from './gameApi';

export interface EventResource {
  eventId: number;
  eventName: string;
  startDate: Date;
  endDate: Date;
  eventCreatorUserId: number;
  eventGames: GameResource[];
}

export interface EventDto {
  eventName: string;
  startDate: number;
  endDate: number;
  eventCreatorUserId: number;
}

/**
 * For updating eventId, eventName, startDate, endDate, eventCreatorUserId,
 * excluding eventGames. See EventGameDto for updating eventGames.
 */
export interface UpdateEventDto {
  eventId: number;
  eventName: string;
  startDate: number;
  endDate: number;
  eventCreatorUserId: number;
}

export interface EventGameDto {
  eventId: number;
  gameId: number;
}

export interface EventModeDto {
  eventId: number;
  modeId: number;
}

export interface EventDate {
  date: Date;
}

export async function getAllEvents(): Promise<EventResource[]> {
  const url = 'http://localhost:8000/events';
  return await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'GET',
  })
    .then(response => response.json())
    .then((data: EventResource[]) => {
      console.log('eventApi: Success getAllEvents():', data);
      return data;
    })
    .catch(error => {
      console.error('eventApi: Error getAllEvents():', error);
      throw error;
    });
}

export async function getCurrentEvents(): Promise<EventResource[]> {
  const url = 'http://localhost:8000/events/current_events';
  return await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'GET',
  })
    .then(response => response.json())
    .then((data: EventResource[]) => {
      console.log('eventApi: Success getCurrentEvents():', data);
      return data;
    })
    .catch(error => {
      console.error('eventApi: Error getCurrentEvents():', error);
      throw error;
    });
}

export async function getModeEventGames(
  eventModeDto: EventModeDto,
): Promise<GameResource[]> {
  const url =
    'http://localhost:8000/event/' +
    eventModeDto.eventId +
    '/mode/' +
    eventModeDto.modeId;
  return await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'GET',
  })
    .then(response => response.json())
    .then((data: GameResource[]) => {
      console.log('gameApi: Success getModeEventGames():', data);
      return data;
    })
    .catch(error => {
      console.error('gameApi: Error getModeEventGames():', error);
      throw error;
    });
}

export async function getEventById(eventId: number): Promise<EventResource> {
  const url = 'http://localhost:8000/events/' + eventId;
  return await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'GET',
  })
    .then(response => response.json())
    .then((data: EventResource) => {
      console.log('eventApi: Success getEventById():', data);
      return data;
    })
    .catch(error => {
      console.error('eventApi: Error getEventById():', error);
      throw error;
    });
}

export async function createEvent(eventDto: EventDto): Promise<EventResource> {
  const url = 'http://localhost:8000/events';
  return await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(eventDto),
  })
    .then(response => {
      console.log('RESPONSE', response);
      return response.json();
    })
    .then((data: EventResource) => {
      console.log('eventApi: Success createEvent():', data);
      return data;
    })
    .catch(error => {
      console.error('eventApi: Error createEvent():', error);
      throw error;
    });
}

export async function updateEvent(
  updateEventDto: UpdateEventDto,
): Promise<EventResource> {
  const url = 'http://localhost:8000/events/' + updateEventDto.eventId;
  return await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'PUT',
    body: JSON.stringify(updateEventDto),
  })
    .then(response => {
      console.log('RESPONSE', response);
      return response.json();
    })
    .then((data: EventResource) => {
      console.log('eventApi: Success updateEvent():', data);
      return data;
    })
    .catch(error => {
      console.error('eventApi: Error updateEvent():', error);
      throw error;
    });
}

export async function addEventGame(
  eventGameDto: EventGameDto,
): Promise<EventResource> {
  const url =
    'http://localhost:8000/events/' +
    eventGameDto.eventId +
    '/games/' +
    eventGameDto.gameId;
  return await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'PUT',
    body: JSON.stringify(eventGameDto),
  })
    .then(response => {
      console.log('RESPONSE', response);
      return response.json();
    })
    .then((data: EventResource) => {
      console.log('eventApi: Success updateEventGames():', data);
      return data;
    })
    .catch(error => {
      console.error('eventApi: Error updateEventGames():', error);
      throw error;
    });
}

export async function deleteEvent(eventId: number): Promise<boolean> {
  const url = 'http://localhost:8000/events/' + eventId;
  return await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'DELETE',
  })
    .then(response => {
      console.log('RESPONSE', response);
      return response.json();
    })
    .then((data: boolean) => {
      console.log('eventApi: Success deleteEvent():', data);
      return data;
    })
    .catch(error => {
      console.error('eventApi: Error deleteEvent():', error);
      throw error;
    });
}
