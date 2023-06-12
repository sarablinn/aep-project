import { useAuth0 } from '@auth0/auth0-react';
import { SwatchesPicker } from 'react-color';
import React, { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { getUserByToken, updateUser, UserResource } from '../services/userApi';
import UserInfoPopup from './UserInfoPopup';
import { useAtom } from 'jotai/index';
import { selectedUser } from '../services/Atoms';
import Loading from '../utilities/Loading';

const UserProfile = () => {
  const { user, isLoading, isAuthenticated, error } = useAuth0();

  const [currentUser, setCurrentUser] = useAtom(selectedUser);

  const [bgColor, setBackgroundColor] = useState(currentUser.backgroundColor);
  const [fgColor, setForegroundColor] = useState(currentUser.foregroundColor);
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

  const {
    data: userResource,
    mutate: getUserByTokenMutation,
    isLoading: loadingGetUser,
  } = useMutation({
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
    isLoading: loadingUpdateUser,
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

  if (isLoading || loadingGetUser || loadingUpdateUser) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  if (error) {
    return <div>ERROR: {error.message}</div>;
  }
  if (isAuthenticated && userResource) {
    return (
      <div className="container-fluid m-3 p-3">
        <div className="m-3 p-3">
          <p>User token: {user?.sub}</p>
          <p>User id: {userResource?.userId}</p>
          <p>Email: {userResource?.email}</p>
          <p>Username: {userResource?.username}</p>
          <p>First Name: {userResource?.firstName}</p>
          <p>Last Name: {userResource?.lastName}</p>
        </div>

        <div className="m-3 flex flex-row justify-center p-3">
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

        <div
          className="w-100 h-25 mx-3 mb-0 mt-3 p-3 text-white"
          style={{ backgroundColor: fgColor }}
        >
          Preview
        </div>
        <div
          className="w-100 h-25 mx-3 mb-5 mt-0 p-3"
          style={{ backgroundColor: bgColor }}
        ></div>
        <div className="flex flex-row justify-center">
          <UserInfoPopup userResource={userResource} isVisible="VISIBLE" />
        </div>
      </div>
    );
  }
};

export default UserProfile;
