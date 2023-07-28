export interface ModeResource {
  modeId: number;
  modeName: string;
  timeLimit: number;
}

export interface ModeDto {
  modeName: string;
  timeLimit: number;
}

export interface Timer {
  minutes: number;
  seconds: number;
  // milliseconds: number;
}

export async function getModes(): Promise<ModeResource[]> {
  const url = 'http://localhost:8000/modes';
  return await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'GET',
  })
    .then(response => response.json())
    .then((data: ModeResource[]) => {
      console.log('modeApi: Success getModes():', data);
      return data;
    })
    .catch(error => {
      console.error('modeApi: Error getModes():', error);
      throw error;
    });
}

export async function getMode(mode_id: number): Promise<ModeResource> {
  const url = 'http://localhost:8000/modes/' + mode_id;
  return await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'GET',
  })
    .then(response => response.json())
    .then((data: ModeResource) => {
      console.log('modeApi: Success getMode():', data);
      if (!data) {
        throw new Error('ERROR: no mode found.');
      }
      return data;
    })
    .catch(error => {
      console.error('modeApi: Error getMode():', error);
      throw error;
    });
}
