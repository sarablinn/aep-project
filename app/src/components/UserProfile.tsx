import { useAuth0 } from '@auth0/auth0-react';
import { ThreeDots } from 'react-loader-spinner';
import { PhotoshopPicker, SwatchesPicker } from 'react-color';
import React, { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { getUserByToken } from '../services/userApi';
import UserInfoPopup from './UserInfoPopup';

const UserProfile = () => {
  const { user, isLoading, isAuthenticated, error } = useAuth0();

  const [bgColor, setBackgroundColor] = useState('FFFFFF');
  const [fgColor, setForegroundColor] = useState('000000');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

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

  const handleBackgroundChangeComplete = (event: any) => {
    setBackgroundColor(event.hex);
  };
  const handleForegroundChangeComplete = (event: any) => {
    setForegroundColor(event.hex);
  };

  const { data: userResource, mutate: getUserByTokenMutation } = useMutation({
    mutationFn: (userToken: string) => getUserByToken(userToken),
    onMutate: () => console.log('mutate'),
    onError: (err, variables, context) => {
      console.log(err, variables, context);
    },
    onSettled: () => console.log('getUserByTokenMutation Settled.'),
  });

  useEffect(() => {
    if (isAuthenticated && user?.sub != null) {
      getUserByTokenMutation(user.sub);
    }
  }, [isAuthenticated, user]);

  if (isLoading) {
    return (
      <div>
        <ThreeDots height="30" width="30" color="white" ariaLabel="loading" />
      </div>
    );
  }
  if (error) {
    return <div>ERROR: {error.message}</div>;
  }
  if (isAuthenticated) {
    return (
      <div className="container m-3 p-3">
        <div>
          <p>User token: {user?.sub}</p>
        </div>
        <p>User id: {userResource?.userId}</p>
        <p>Email: {userResource?.email}</p>
        <p>Username: {userResource?.username}</p>
        <p>First Name: {userResource?.firstName}</p>
        <p>Last Name: {userResource?.lastName}</p>

        <div className="m-3 p-3">
          <div className="flex">
            <div className="pr-3">
              <label htmlFor="username-input">Username: </label>
            </div>
            <div>
              <input
                className="rounded-sm border border-black"
                type="text"
                name="username-input"
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
        </div>

        <div className="flex">
          <div>
            <p>Background Color</p>
            <SwatchesPicker
              className="user-profile-sketchpicker m-3 p-3"
              // header="Background Color"
              color={userResource?.backgroundColor}
              // onAccept={handleBackgroundChangeComplete}
              onChangeComplete={handleBackgroundChangeComplete}
            />
          </div>
          <div>
            <p>Foreground Color</p>
            <SwatchesPicker
              className="user-profile-sketchpicker m-3 p-3"
              // header="Foreground Color"
              color={userResource?.foregroundColor}
              // onAccept={handleForegroundChangeComplete}
              onChangeComplete={handleForegroundChangeComplete}
            />
          </div>
        </div>
        <div className="w-25 h-25 m-3 p-3" style={{ backgroundColor: bgColor }}>
          Preview
        </div>
        <UserInfoPopup />
      </div>
    );
  }
};

export default UserProfile;
