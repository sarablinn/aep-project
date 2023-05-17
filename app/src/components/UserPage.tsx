import { useMutation, useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { createUser, getUsers } from './../services/userApi';
import Loading from './../utilities/Loading';
import Error from './../utilities/Error';
import { selectedUser } from './../services/Atoms';
import { useAtom } from 'jotai';
import { PhotoshopPicker } from 'react-color';

const UserPage = () => {
  const [bgColor, setBackgroundColor] = useState('FFFFFF');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  // const [first_name, setFirstName] = useState('');
  // const [last_name, setLastName] = useState('');
  // const [role_id, setRoleId] = useState(3);
  const [user, setUser] = useAtom(selectedUser);

  const changeUsername = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const changeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  // const changeFirstName = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setFirstName(event.target.value);
  // };
  //
  // const changeLastName = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setLastName(event.target.value);
  // };
  //
  // const changeRoleId = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setRoleId(event.target.valueAsNumber);
  // };

  const handleBackgroundChangeComplete = (event: any) => {
    setBackgroundColor(event.hex);
  };

  const { data, mutate } = useMutation({
    mutationFn: () =>
      createUser({
        username: username,
        email: email,
        // first_name: first_name,
        // last_name: last_name,
        // role_id: role_id,
        backgroundColor: bgColor,
      }),
    onMutate: () => console.log('mutate'),
    onError: (err, variables, context) => {
      console.log(err, variables, context);
    },
    onSettled: () => console.log('COMPLETE: user created.'),
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

  useEffect(() => {
    return () => {
      // TODO fix refetch.then()
      // usersRefetch().then();
    };
  }, [data]);

  if (usersAreLoading)
    return (
      <div>
        <Loading />
      </div>
    );

  if (usersError) return <Error />;

  if (usersData) {
    return (
      <div>
        <div className="m-3 p-3">
          <div>
            <label>Username: </label>
            <input
              type="text"
              value={username}
              onChange={changeUsername}
            ></input>
          </div>
          <div>
            <label>Email: </label>
            <input type="text" value={email} onChange={changeEmail}></input>
          </div>
          {/*<div>*/}
          {/*  <label>First Name: </label>*/}
          {/*  <input*/}
          {/*    type="text"*/}
          {/*    value={first_name}*/}
          {/*    onChange={changeFirstName}*/}
          {/*  ></input>*/}
          {/*</div>*/}
          {/*<div>*/}
          {/*  <label>Last Name: </label>*/}
          {/*  <input*/}
          {/*    type="text"*/}
          {/*    value={last_name}*/}
          {/*    onChange={changeLastName}*/}
          {/*  ></input>*/}
          {/*</div>*/}
          {/*<div>*/}
          {/*  <label>Role: </label>*/}
          {/*  <input type="text" value={role_id} onChange={changeRoleId}></input>*/}
          {/*</div>*/}
        </div>

        <div>
          <div className="m-3 p-3">
            <label>Background Color: </label>
            <PhotoshopPicker
              color={bgColor}
              onChangeComplete={handleBackgroundChangeComplete}
            />
          </div>
        </div>

        <div className="w-25 h-25 m-3 p-3" style={{ backgroundColor: bgColor }}>
          Preview
        </div>

        <button className="m-3 bg-red-500 p-3" onClick={() => mutate()}>
          Submit new user
        </button>

        <div className="m-3 p-3">
          <div>Selected User: {user.username}</div>
          {usersData.map((user, index) => (
            <div key={index} className="border">
              <div>username: {user.username}</div>
              <div>email: {user.email}</div>
              {/*<div>first name: {user.first_name}</div>*/}
              {/*<div>last name: {user.last_name}</div>*/}
              {/*<div>role id: {user.role_id}</div>*/}

              <div className={'flex flex-row justify-center'}>
                <div>background color: {user.backgroundColor}</div>
                <div
                  className="h-4 w-4"
                  style={{ backgroundColor: user.backgroundColor }}
                ></div>
              </div>
              <button className="bg-red-700" onClick={() => setUser(user)}>
                Select User
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return <></>;
};

export default UserPage;
