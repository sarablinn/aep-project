import { Role } from './roleApi';

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

export interface UserRole {
  userId: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  backgroundColor: string;
  foregroundColor: string;
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
      console.log('Success getUsers():', data);
      return data;
    })
    .catch(error => {
      console.error('Error getUsers():', error);
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
      console.log('Success getUserByToken():', data);
      return data;
    })
    .catch(error => {
      console.error('Error getUserByToken():', error);
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
      console.log('Success getUserByToken():', data);
      return data;
    })
    .catch(error => {
      console.error('Error getUserByToken():', error);
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
      console.log('Success createUser():', data);
      return data;
    })
    .catch(error => {
      console.error('Error createUser():', error);
      throw error;
    });
}

// export async function getOrCreateUser(userDto: UserDto): Promise<UserResource> {
//   const url = 'http://localhost:8000/users';
//   console.log('GETORCREATE REACHED');
//   return await fetch(url, {
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     method: 'POST',
//     body: JSON.stringify(userDto),
//   })
//     // .then(response => console.log('RESPONSE', response))
//     .then(response => {
//       console.log('RESPONSE', response);
//       return response.json();
//     })
//     .then((data: UserResource) => {
//       console.log('Success getOrCreateUser():', data);
//       return data;
//     })
//     .catch(error => {
//       console.error('Error getOrCreateUser():', error);
//       throw error;
//     });
// }

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
      console.log('Success updateUser():', data);
      return data;
    })
    .catch(error => {
      console.error('Error updateUser():', error);
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
      console.log('Success deleteUser():', data);
      return data;
    })
    .catch(error => {
      console.error('Error deleteUser():', error);
      throw error;
    });
}
