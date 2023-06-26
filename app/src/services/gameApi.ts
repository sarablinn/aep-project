export interface GameGrid {
  rows: Array<Array<number>>;
}

export interface NumberSelection {
  rowIndex: number | null;
  colIndex: number | null;
  value: number | null;
}

// export async function createUser(userDto: UserDto): Promise<UserResource> {
//   const url = 'http://localhost:8000/users';
//   return await fetch(url, {
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     method: 'POST',
//     body: JSON.stringify(userDto),
//   })
//     .then(response => {
//       console.log('RESPONSE', response);
//       return response.json();
//     })
//     .then((data: UserResource) => {
//       console.log('userApi: Success createUser():', data);
//       return data;
//     })
//     .catch(error => {
//       console.error('userApi: Error createUser():', error);
//       throw error;
//     });
// }
