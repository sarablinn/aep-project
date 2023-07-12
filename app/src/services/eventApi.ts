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
  eventResource: EventResource,
): Promise<EventResource> {
  const url = 'http://localhost:8000/events/' + eventResource.eventId;
  return await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'PUT',
    body: JSON.stringify(eventResource),
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
