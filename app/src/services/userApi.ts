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
  firstName: string | undefined;
  lastName: string | undefined;
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

export interface getUser {
  userId: number;
}

// export async function createUser(createUser: {
//   username: string;
//   email: string;
//   userToken: string;
//   firstName: string;
//   lastName: string;
//   roleId: number;
//   backgroundColor: string;
// }): Promise<UserResource> {
//   const url = 'http://localhost:8000/users';
//   return await fetch(url, {
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     method: 'POST',
//     body: JSON.stringify(createUser),
//   })
//     .then(response => response.json())
//     .then((data: UserResource) => {
//       console.log('Success:', data);
//       return data;
//     })
//     .catch(error => {
//       console.error('Error:', error);
//       throw error;
//     });
// }

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
      console.log('Success:', data);
      return data;
    })
    .catch(error => {
      console.error('Error:', error);
      throw error;
    });
}

export async function getUser(getUser: {
  userId: number;
}): Promise<UserResource> {
  const url = 'http://localhost:8000/users/' + getUser.userId;
  return await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'GET',
  })
    .then(response => response.json())
    .then((data: UserResource) => {
      console.log('Success:', data);
      return data;
    })
    .catch(error => {
      console.error('Error:', error);
      throw error;
    });
}

export async function getUserByToken(getUser: {
  userToken: string;
}): Promise<UserResource> {
  const url = 'http://localhost:8000/users/profile/' + getUser.userToken;
  return await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'GET',
  })
    .then(response => response.json())
    .then((data: UserResource) => {
      console.log('Success:', data);
      return data;
    })
    .catch(error => {
      console.error('Error:', error);
      throw error;
    });
}

export async function getOrCreateUser(userDto: UserDto): Promise<UserResource> {
  const url = 'http://localhost:8000/users';
  console.log('GETORCREATE REACHED');
  return await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(userDto),
  })
    // .then(response => console.log('RESPONSE', response))
    .then(response => {
      console.log('RESPONSE', response);
      return response.json();
    })
    .then((data: UserResource) => {
      console.log('Create User Success:', data);
      return data;
    })
    .catch(error => {
      console.error('Error:', error);
      throw error;
    });
}
