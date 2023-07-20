import { useAuth0 } from '@auth0/auth0-react';
import { SwatchesPicker } from 'react-color';
import React, { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { getUserByToken, updateUser, UserResource } from '../services/userApi';
import { useAtom } from 'jotai/index';
import { selectedUser } from '../services/Atoms';
import Loading from '../utilities/Loading';
import UserInfoPopup from './UserInfoPopup';

const UserProfile = () => {
  const { user, isLoading, isAuthenticated, error } = useAuth0();

  const [currentUser, setCurrentUser] = useAtom(selectedUser);
  const [showPopup, setShowPopup] = useState(false);

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

  /**
   * getUserByTokenMutation --> getUserByToken(userToken)
   */
  const {
    data: userResource,
    mutate: getUserByTokenMutation,
    isLoading: loadingGetUser,
  } = useMutation({
    mutationFn: (userToken: string) => getUserByToken(userToken),
    onMutate: () => console.log('UserProfile: Mutate: getUserByTokenMutation'),
    onError: (err, variables, context) => {
      console.log(err, variables, context);
    },
    onSuccess: data => {
      setCurrentUser(data);
      console.log('UserProfile: Success: getUserByTokenMutation:', data);
    },
    onSettled: () =>
      console.log('UserProfile: Settled: getUserByTokenMutation.'),
  });

  /**
   * updateUserMutation --> updateUser(userResource)
   */
  const {
    data: resultsFromUpdateUser,
    mutate: updateUserMutation,
    error: updateUserError,
    isLoading: loadingUpdateUser,
  } = useMutation({
    mutationFn: (userResourceInput: UserResource) =>
      updateUser(userResourceInput),
    onMutate: () => console.log('UserProfile: Mutate: updateUserMutation'),
    onError: (err, variables, context) => {
      console.log(err, variables, context);
    },
    onSettled: () => console.log('UserProfile: Settled: updateUserMutation'),
  });

  /**
   *
   */
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

  const displayUserInfoPopup = () => {
    if (showPopup) {
      setShowPopup(false);
    }
    if (!showPopup) {
      setShowPopup(true);
    }
  };

  if (isAuthenticated && userResource) {
    return (
      <div className="container-fluid m-3 p-3">
        <div className="m-3 p-3">
          {/*<p>User token: {user?.sub}</p>*/}
          {/*<p>User id: {userResource?.userId}</p>*/}
          <p>Email: {userResource?.email}</p>
          <p>Username: {userResource?.username}</p>
          <p>First Name: {userResource?.firstName}</p>
          <p>Last Name: {userResource?.lastName}</p>
        </div>

        <div>
          <button
            className="m-1 rounded bg-pink-500 p-3 font-bold text-white shadow outline-none hover:shadow-lg focus:outline-none active:bg-pink-600"
            onClick={displayUserInfoPopup}
          >
            UPDATE PROFILE
          </button>
        </div>

        {showPopup ? (
          <UserInfoPopup
            userResource={currentUser}
            isVisible={true}
            isButtonAlwaysVisible={true}
          />
        ) : null}

        <div className="m-3 flex flex-row justify-center p-3">
          <div>
            <p>Background Color</p>
            <SwatchesPicker
              className="user-profile-sketchpicker m-3 p-3"
              color={currentUser?.backgroundColor}
              onChangeComplete={handleBackgroundChangeComplete}
            />
          </div>
          <div>
            <p>Foreground Color</p>
            <SwatchesPicker
              className="user-profile-sketchpicker m-3 p-3"
              color={currentUser?.foregroundColor}
              onChangeComplete={handleForegroundChangeComplete}
            />
          </div>
        </div>

        <div
          className="mx-3 mb-5 mt-3"
          style={{
            border: '3px solid',
            borderColor: fgColor,
          }}
        >
          <div
            className="w-100 h-25 mb-0  p-3 text-white"
            style={{ backgroundColor: fgColor }}
          >
            Preview
          </div>
          <div
            className="w-100 h-25 mt-0 p-3"
            style={{ backgroundColor: bgColor }}
          ></div>
        </div>
      </div>
    );
  }
};

export default UserProfile;
