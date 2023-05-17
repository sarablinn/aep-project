export interface createUser {
  username: string;
  // first_name: string;
  // last_name: string;
  email: string;
  backgroundColor: string;
}

export interface userResource {
  user_id: number;
  username: string;
  email: string;
  // first_name: string;
  // last_name: string;
  // role_id: number;
  backgroundColor: string;
}

export async function createUser(createUser: {
  backgroundColor: string;
  // role_id: number;
  // last_name: string;
  // first_name: string;
  email: string;
  username: string;
}): Promise<userResource> {
  const url = 'http://localhost:8000/users';
  return await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(createUser),
  })
    .then(response => response.json())
    .then((data: userResource) => {
      console.log('Success:', data);
      return data;
    })
    .catch(error => {
      console.error('Error:', error);
      throw error;
    });
}

export async function getUsers(): Promise<userResource[]> {
  const url = 'http://localhost:8000/users';
  return await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'GET',
  })
    .then(response => response.json())
    .then((data: userResource[]) => {
      console.log('Success:', data);
      return data;
    })
    .catch(error => {
      console.error('Error:', error);
      throw error;
    });
}
