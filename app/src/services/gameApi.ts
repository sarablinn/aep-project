import { UserResource } from './userApi';

export interface GameGrid {
  rows: Array<Array<number>>;
}

export interface NumberSelection {
  rowNum: number | null; // row number
  colNum: number | null; // column number
  value: number | null;
}

export interface GameResource {
  game_id: number;
  user_id: number;
  mode_id: number;
  timestamp: Date;
  score: number;
}

export interface GameDto {
  user_id: number;
  mode_id: number;
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
