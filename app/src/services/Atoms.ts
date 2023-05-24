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
  roleId: 3, // GUEST
  // foregroundColor: '000000',
  backgroundColor: 'FFFFFF',
  foregroundColor: '000000',
};

const defaultRole = {
  roleId: 3,
  roleName: 'GUEST',
};

export const selectedUser = atom<UserResource>(defaultUser);
export const selectedRole = atom<Role>(defaultRole);
