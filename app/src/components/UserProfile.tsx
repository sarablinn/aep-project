import { useAuth0 } from '@auth0/auth0-react';
import { ThreeDots } from 'react-loader-spinner';
import { SwatchesPicker } from 'react-color';
import React, { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { getUserByToken, updateUser, UserResource } from '../services/userApi';
import UserInfoPopup from './UserInfoPopup';
import { useAtom } from 'jotai/index';
import { selectedUser } from '../services/Atoms';

const UserProfile = () => {
  const { user, isLoading, isAuthenticated, error } = useAuth0();

  const [currentUser, setCurrentUser] = useAtom(selectedUser);

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

  const {
    data: resultsFromUpdateUser,
    mutate: updateUserMutation,
    error: updateUserError,
  } = useMutation({
    mutationFn: (userResourceInput: UserResource) =>
      updateUser(userResourceInput),
    onMutate: () => console.log('mutate'),
    onError: (err, variables, context) => {
      console.log(err, variables, context);
    },
    onSettled: () => console.log('updateUserMutation Settled.'),
  });

  useEffect(() => {
    if (isAuthenticated && user?.sub != null) {
      getUserByTokenMutation(user.sub);
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (userResource) {
      setCurrentUser(userResource);
    }
  }, [userResource]);

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
  if (isAuthenticated && userResource) {
    return (
      <div className="container m-3 p-3">
        <UserInfoPopup userResource={userResource} isVisible="INVISIBLE" />
        <div>
          <p>User token: {user?.sub}</p>
        </div>
        <p>User id: {userResource?.userId}</p>
        <p>Email: {userResource?.email}</p>
        <p>Username: {userResource?.username}</p>
        <p>First Name: {userResource?.firstName}</p>
        <p>Last Name: {userResource?.lastName}</p>

        <div className="m-3 flex p-3">
          <div>
            <p>Background Color</p>
            <SwatchesPicker
              className="user-profile-sketchpicker m-3 p-3"
              color={userResource?.backgroundColor}
              onChangeComplete={handleBackgroundChangeComplete}
            />
          </div>
          <div>
            <p>Foreground Color</p>
            <SwatchesPicker
              className="user-profile-sketchpicker m-3 p-3"
              color={userResource?.foregroundColor}
              onChangeComplete={handleForegroundChangeComplete}
            />
          </div>
        </div>

        <div className="w-25 h-25 m-3 p-3" style={{ backgroundColor: bgColor }}>
          Preview
        </div>
      </div>
    );
  }
};

export default UserProfile;
