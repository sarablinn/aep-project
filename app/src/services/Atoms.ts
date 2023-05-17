import { atom } from 'jotai';
import { userResource } from './userApi';
import { roleData } from './roleApi';

const defaultUser = {
  user_id: 0,
  username: 'guest',
  email: '',
  // first_name: '',
  // last_name: '',
  // role_id: 3, // GUEST
  // foregroundColor: '000000',
  backgroundColor: 'FFFFFF',
};

const defaultRole = {
  role_id: 3,
  role_name: 'GUEST',
};

export const selectedUser = atom<userResource>(defaultUser);
export const selectedRole = atom<roleData>(defaultRole);
