import { UserResource } from './userApi';
import { ModeResource } from './modeApi';

export interface GameGrid {
  rows: Array<Array<number>>;
}

export interface NumberSelection {
  rowNum: number | null; // row number
  colNum: number | null; // column number
  value: number | null;
}

export interface GameResource {
  gameId: number;
  user: UserResource;
  mode: ModeResource;
  timestamp: Date;
  score: number;
}

export interface GamesByMode {
  modeGames: Array<Array<GameResource>>;
}

export interface ModeGames {
  mode: ModeResource;
  games: GameResource[];
}

// export interface GameResource {
//   gameId: number;
//   userId: number;
//   modeId: number;
//   timestamp: Date;
//   score: number;
// }

// export interface GameDto {
//   userId: number;
//   modeId: number;
//   timestamp: any;
//   score: number;
// }

export interface GameDto {
  userToken: string;
  modeId: number;
  timestamp: any;
  score: number;
}

export interface GuestGameDto {
  mode: ModeResource;
  timestamp: Date;
  score: number;
}

export async function getAllGames(): Promise<GameResource[]> {
  const url = 'http://localhost:8000/games';
  return await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'GET',
  })
    .then(response => response.json())
    .then((data: GameResource[]) => {
      console.log('gameApi: Success getAllGames():', data);
      return data;
    })
    .catch(error => {
      console.error('gameApi: Error getAllGames():', error);
      throw error;
    });
}

export async function getAllGamesByUser(
  $userId: string,
): Promise<GameResource[]> {
  const url = 'http://localhost:8000/games/user/' + $userId;
  return await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'GET',
  })
    .then(response => response.json())
    .then((data: GameResource[]) => {
      console.log('gameApi: Success getAllGamesByUser():', data);
      return data;
    })
    .catch(error => {
      console.error('gameApi: Error getAllGamesByUser():', error);
      throw error;
    });
}

export async function getAllGamesOrderedByScore(): Promise<GameResource[]> {
  const url = 'http://localhost:8000/games/topscores';
  return await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'GET',
  })
    .then(response => response.json())
    .then((data: GameResource[]) => {
      console.log('gameApi: Success getAllGamesOrderByScore():', data);
      return data;
    })
    .catch(error => {
      console.error('gameApi: Error getAllGamesOrderByScore():', error);
      throw error;
    });
}

// ordered by scores desc
export async function getGamesByMode(mode_id: number): Promise<GameResource[]> {
  const url = 'http://localhost:8000/games/topscores/modes/' + mode_id;
  return await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'GET',
  })
    .then(response => response.json())
    .then((data: GameResource[]) => {
      console.log('gameApi: Success getAllGamesByModeOrderByScore():', data);
      return data;
    })
    .catch(error => {
      console.error('gameApi: Error getAllGamesByModeOrderByScore():', error);
      throw error;
    });
}

export async function getAllGamesByModes(): Promise<GamesByMode> {
  const url = 'http://localhost:8000/games/topscores/modes';
  return await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'GET',
  })
    .then(response => response.json())
    .then((data: GamesByMode) => {
      console.log('gameApi: Success getAllGamesByModes():', data);
      return data;
    })
    .catch(error => {
      console.error('gameApi: Error getAllGamesByModes():', error);
      throw error;
    });
}

export async function getAllGamesByEvent(
  event_id: number,
): Promise<GamesByMode> {
  const url = 'http://localhost:8000/games/topscores/event/' + event_id;
  return await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'GET',
  })
    .then(response => response.json())
    .then((data: GamesByMode) => {
      console.log('gameApi: Success getAllGamesByEvent():', data);
      return data;
    })
    .catch(error => {
      console.error('gameApi: Error getAllGamesByEvent():', error);
      throw error;
    });
}

export async function createGame(gameDto: GameDto): Promise<GameResource> {
  const url = 'http://localhost:8000/games';
  return await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(gameDto),
  })
    .then(response => {
      console.log('RESPONSE', response);
      return response.json();
    })
    .then((data: GameResource) => {
      console.log('gameApi: Success createGame():', data);
      return data;
    })
    .catch(error => {
      console.error('gameApi: Error createGame():', error);
      throw error;
    });
}
