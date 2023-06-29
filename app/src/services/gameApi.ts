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
