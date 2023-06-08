import { useMutation, useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { deleteUser, getUserById, getUsers } from './../services/userApi';
import Loading from './../utilities/Loading';
import Error from './../utilities/Error';
import { selectedUser } from './../services/Atoms';
import { useAtom } from 'jotai';
import { PhotoshopPicker } from 'react-color';
import { getRoles } from '../services/roleApi';

const UserPage = () => {
  const [bgColor, setBackgroundColor] = useState('FFFFFF');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [userToken, setUserToken] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const [user, setUser] = useAtom(selectedUser);
  const [userId] = useState(user.userId);
  const [roleId, setRoleId] = useState(user.roleId);

  const changeUsername = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const changeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const changeFirstName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFirstName(event.target.value);
  };

  const changeLastName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLastName(event.target.value);
  };

  const changeRoleId = (event: React.ChangeEvent<HTMLOptionElement>) => {
    const id = Number(event.target.value);
    setRoleId(id);
  };

  const changeUserToken = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserToken(event.target.value);
  };

  const handleBackgroundChangeComplete = (event: any) => {
    setBackgroundColor(event.hex);
  };

  const { data, mutate: createMutate } = useMutation({
    // put parameters in ()
    mutationFn: () => getUserById(userId),
    onMutate: () => console.log('createUserMutation mutate'),
    onError: (err, variables, context) => {
      console.log(err, variables, context);
    },
    onSettled: () => console.log('COMPLETE: user created.'),
  });

  const { mutate: deleteUserMutation } = useMutation({
    // put parameters in ()
    mutationFn: (userId: number) => deleteUser(userId),
    onMutate: () => console.log('deleteUserMutation mutate'),
    onError: (err, variables, context) => {
      console.log(err, variables, context);
    },
    onSettled: () => console.log('COMPLETE: user deleted.'),
  });

  const {
    isLoading: usersAreLoading,
    error: usersError,
    data: usersData,
    // refetch: usersRefetch,
  } = useQuery({
    queryKey: [`users`],
    queryFn: () => getUsers(),
  });

  const {
    isLoading: rolesAreLoading,
    error: rolesError,
    data: rolesData,
    // refetch: usersRefetch,
  } = useQuery({
    queryKey: [`roles`],
    queryFn: () => getRoles(),
  });

  const rolesMap = new Map<number, string>();
  rolesData?.map(role => {
    rolesMap.set(role.roleId, role.roleName);
  });

  useEffect(() => {
    return () => {
      // TODO fix refetch.then()
      // usersRefetch().then();
    };
  }, [data]);

  if (usersAreLoading || rolesAreLoading)
    return (
      <div>
        <Loading />
      </div>
    );

  if (usersError || rolesError) return <Error />;

  if (usersData) {
    return (
      <div className="">
        <div className="m-3 p-3">
          <div className="flex">
            <div className="pr-3">
              <label>Username: </label>
            </div>
            <div>
              <input
                className="rounded-sm border border-black"
                type="text"
                value={username}
                onChange={changeUsername}
              ></input>
            </div>
          </div>
          <div className="flex">
            <div className="pr-3">
              <label>Email: </label>
            </div>
            <div>
              <input
                className="rounded-sm border border-black"
                type="text"
                value={email}
                onChange={changeEmail}
              ></input>
            </div>
          </div>
          <div className="flex">
            <div className="pr-3">
              <label>First Name: </label>
            </div>
            <input
              className="rounded-sm border border-black"
              type="text"
              value={firstName}
              onChange={changeFirstName}
            ></input>
          </div>
          <div className="flex">
            <div className="pr-3">
              <label>Last Name: </label>
            </div>
            <input
              className="rounded-sm border border-black"
              type="text"
              value={lastName}
              onChange={changeLastName}
            ></input>
          </div>
          <div className="flex">
            <div className="pr-3">
              <label htmlFor="role-dropdown-input">Role: </label>
            </div>
            <select
              className="rounded-sm border border-black"
              name="role-dropdown-input"
            >
              {rolesData?.map(role => (
                <option key={role.roleId} onChange={changeRoleId}>
                  {role.roleName}
                </option>
              ))}
            </select>
            {/*<input*/}
            {/*  className="rounded-sm border border-black"*/}
            {/*  type="text"*/}
            {/*  value={roleId}*/}
            {/*  onChange={changeRoleId}*/}
            {/*></input>*/}
          </div>
        </div>
        <div className="flex">
          <div className="m-3 p-3">
            <label>Background Color: </label>
            <PhotoshopPicker
              className="user-profile-sketchpicker"
              header="Background Color"
              color={bgColor}
              onChangeComplete={handleBackgroundChangeComplete}
            />
          </div>
        </div>
        <div className="w-25 h-25 m-3 p-3" style={{ backgroundColor: bgColor }}>
          Preview
        </div>
        <button className="m-3 bg-red-500 p-3" onClick={() => createMutate()}>
          Submit new user
        </button>
        <div className="m-3 p-3">
          <div>Selected User: {user.username}</div>
          {usersData.map((user, index) => (
            <div key={index} className="border">
              <div>username: {user.username}</div>
              <div>email: {user.email}</div>
              <div>first name: {user.firstName}</div>
              <div>last name: {user.lastName}</div>
              <div>role: {rolesMap.get(user.roleId)}</div>
              <div className={'flex flex-row justify-center'}>
                <div>background color: {user.backgroundColor}</div>
                <div
                  className="h-4 w-4"
                  style={{ backgroundColor: user.backgroundColor }}
                ></div>
              </div>
              <button
                className="mx-2 bg-red-700 px-2"
                onClick={() => setUser(user)}
              >
                Select
              </button>
              {/*<button*/}
              {/*  className="mx-2 bg-red-700 px-2"*/}
              {/*  onClick={() => {*/}
              {/*    deleteUser(user);*/}
              {/*    window.location.reload();*/}
              {/*  }}*/}
              {/*>*/}
              {/*  Delete*/}
              {/*</button>*/}
            </div>
          ))}
        </div>
      </div>
    );
  }
  return <></>;
};

export default UserPage;
