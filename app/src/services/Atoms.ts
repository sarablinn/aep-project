import { atom } from 'jotai';
import { UserResource } from './userApi';
import { Role } from './roleApi';

const defaultUser = {
  userId: 0,
  username: 'guest',
  email: '',
  userToken: '',
  firstName: '',
  lastName: '',
  roleId: 1, // USER
  backgroundColor: '#1a237e',
  foregroundColor: '#f06292',
};

const defaultRole = {
  roleId: 1,
  roleName: 'USER',
};

export function updateCurrentUser(userResource: UserResource): void {
  defaultUser.userId = userResource.userId;
  defaultUser.username = userResource.username;
  defaultUser.email = userResource.email;
  defaultUser.userToken = userResource.userToken;
  defaultUser.firstName = userResource.firstName;
  defaultUser.lastName = userResource.lastName;
  defaultUser.roleId = userResource.roleId;
  defaultUser.backgroundColor = userResource.backgroundColor;
  defaultUser.foregroundColor = userResource.foregroundColor;
}

export const guestUser = atom<UserResource>(defaultUser);
export const loggedInUser = atom(null);

export const selectedUser = atom(
  get => get(loggedInUser) ?? get(guestUser),
  (get, set, updatedUser) => {
    const nextUser =
      typeof updatedUser === 'function'
        ? updatedUser(get(selectedUser))
        : updatedUser;
    set(loggedInUser, nextUser);
  },
);

// export const selectedUser = atom<UserResource>(defaultUser);
export const selectedRole = atom<Role>(defaultRole);
