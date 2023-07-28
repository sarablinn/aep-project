export interface UserResource {
  userId: number;
  username: string;
  email: string;
  userToken: string;
  firstName: string;
  lastName: string;
  roleId: number;
  backgroundColor: string;
  foregroundColor: string;
}

export interface UserDto {
  username: string | undefined;
  email: string | undefined;
  userToken: string | undefined;
  firstName: string | undefined | null;
  lastName: string | undefined | null;
  roleId: number | undefined;
  backgroundColor: string | undefined;
  foregroundColor: string | undefined;
}

export async function getUsers(): Promise<UserResource[]> {
  const url = 'http://localhost:8000/users';
  return await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'GET',
  })
    .then(response => response.json())
    .then((data: UserResource[]) => {
      console.log('userApi: Success getUsers():', data);
      return data;
    })
    .catch(error => {
      console.error('userApi: Error getUsers():', error);
      throw error;
    });
}

export async function getUserByToken(userToken: string): Promise<UserResource> {
  const url = 'http://localhost:8000/users/' + userToken;
  return await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'GET',
  })
    .then(response => response.json())
    .then((data: UserResource) => {
      console.log('userApi: Success getUserByToken():', data);
      if (!data) {
        throw new Error('ERROR: no user found.');
      }
      return data;
    })
    .catch(error => {
      console.error('userApi: Error getUserByToken():', error);
      throw error;
    });
}

export async function getUserById(userId: number): Promise<UserResource> {
  const url = 'http://localhost:8000/users/id/' + userId;
  return await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'GET',
  })
    .then(response => response.json())
    .then((data: UserResource) => {
      console.log('userApi: Success getUserByToken():', data);
      return data;
    })
    .catch(error => {
      console.error('userApi: Error getUserByToken():', error);
      throw error;
    });
}

export async function createUser(userDto: UserDto): Promise<UserResource> {
  const url = 'http://localhost:8000/users';
  return await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(userDto),
  })
    .then(response => {
      console.log('RESPONSE', response);
      return response.json();
    })
    .then((data: UserResource) => {
      console.log('userApi: Success createUser():', data);
      return data;
    })
    .catch(error => {
      console.error('userApi: Error createUser():', error);
      throw error;
    });
}

export async function updateUser(
  userResource: UserResource,
): Promise<UserResource> {
  const url = 'http://localhost:8000/users/' + userResource.userToken;
  return await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'PUT',
    body: JSON.stringify(userResource),
  })
    // .then(response => console.log('RESPONSE', response))
    .then(response => {
      console.log('RESPONSE', response);
      return response.json();
    })
    .then((data: UserResource) => {
      console.log('userApi: Success updateUser():', data);
      return data;
    })
    .catch(error => {
      console.error('userApi: Error updateUser():', error);
      throw error;
    });
}

export async function deleteUser(userId: number): Promise<boolean> {
  const url = 'http://localhost:8000/users/' + userId;
  return await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'DELETE',
    // body: JSON.stringify(role),
  })
    .then(response => response.json())
    .then((data: boolean) => {
      console.log('userApi: Success deleteUser():', data);
      return data;
    })
    .catch(error => {
      console.error('userApi: Error deleteUser():', error);
      throw error;
    });
}

export async function isAvailableUsername(username: string): Promise<boolean> {
  const url = 'http://localhost:8000/users/validate/' + username;
  return await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'GET',
  })
    .then(response => response.json())
    .then((data: boolean) => {
      console.log('userApi: Success isAvailableUsername():', data);
      return data;
    })
    .catch(error => {
      console.error('userApi: Error isAvailableUsername():', error);
      throw error;
    });
}
