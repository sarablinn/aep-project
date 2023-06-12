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
  backgroundColor: '#7986cb',
  foregroundColor: '#3f51b5',
};

const defaultRole = {
  roleId: 1,
  roleName: 'USER',
};

export const selectedUser = atom<UserResource>(defaultUser);
export const selectedRole = atom<Role>(defaultRole);
