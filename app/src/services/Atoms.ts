import { atom } from 'jotai';
import { UserResource } from './userApi';
import { Role } from './roleApi';

const defaultUser = {
  userId: 0,
  username: '',
  email: '',
  userToken: '',
  firstName: '',
  lastName: '',
  roleId: 1, // USER
  // foregroundColor: '000000',
  backgroundColor: 'FFFFFF',
  foregroundColor: '000000',
};

const defaultRole = {
  roleId: 1,
  roleName: 'USER',
};

export const selectedUser = atom<UserResource>(defaultUser);
export const selectedRole = atom<Role>(defaultRole);
