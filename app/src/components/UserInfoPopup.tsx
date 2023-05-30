import { useAuth0 } from '@auth0/auth0-react';
import '../styles/navbar.css';
import { useMutation } from '@tanstack/react-query';
import { updateUser, UserResource } from '../services/userApi';
import React, { useEffect, useState } from 'react';
import { ThreeDots } from 'react-loader-spinner';
import PropTypes from 'prop-types';

const UserInfoPopup = (
  { userResource }: { userResource: UserResource },
  { isVisible }: { isVisible: string },
) => {
  const { user, isLoading, error } = useAuth0();
  const [showModal, setShowModal] = useState(false);

  const [username, setUsername] = useState(userResource.username);
  const [email, setEmail] = useState(userResource.email);
  const [firstName, setFirstName] = useState(userResource.firstName);
  const [lastName, setLastName] = useState(userResource.lastName);
  const [bgColor, setBackgroundColor] = useState(userResource.backgroundColor);
  const [fgColor, setForegroundColor] = useState(userResource.foregroundColor);

  useEffect(() => {
    if (isVisible == 'VISIBLE') {
      setShowModal(true);
      console.log('SHOW MODAL CHANGED: true');
    }

    if (isVisible == 'INVISIBLE') {
      setShowModal(false);
      console.log('SHOW MODAL CHANGED: false');
    }
  }, [isVisible]);

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
    data: userResults,
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

  // if (updateUserError) {
  //   return <div>ERROR: {updateUserError}</div>;
  // }

  function saveChangesAndReload() {
    updateUserMutation({
      userId: userResource.userId,
      username: username,
      email: email,
      userToken: userResource.userToken,
      firstName: firstName,
      lastName: lastName,
      roleId: userResource.roleId,
      backgroundColor: bgColor,
      foregroundColor: fgColor,
    });
    window.location.reload();
    setShowModal(false);
  }

  return (
    <>
      <button
        className="mb-1 mr-1 rounded bg-pink-500 px-6 py-3 text-sm font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-lg focus:outline-none active:bg-pink-600"
        type="button"
        onClick={() => setShowModal(true)}
      >
        Update User Profile
      </button>
      {showModal ? (
        <>
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none focus:outline-none">
            <div className="relative mx-auto my-6 w-auto max-w-3xl">
              {/*content*/}
              <div className="relative flex w-full flex-col rounded-lg border-0 bg-white shadow-lg outline-none focus:outline-none">
                {/*header*/}
                <div></div>
                <div className="m-3 p-3">
                  <form>
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
                          required
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
                          required
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
                        required
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
                        required
                      ></input>
                    </div>
                  </form>
                </div>
                <div className="flex items-start">
                  <button
                    className="background-transparent mb-1 mr-1 px-6 py-2 text-sm font-bold uppercase text-red-500 outline-none transition-all duration-150 ease-linear focus:outline-none"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                  <button
                    className="mb-1 mr-1 rounded bg-emerald-500 px-6 py-3 text-sm font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-lg focus:outline-none active:bg-emerald-600"
                    type="button"
                    onClick={() => saveChangesAndReload()}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="fixed inset-0 z-40 bg-black opacity-25"></div>
        </>
      ) : null}
    </>
  );
};

UserInfoPopup.propTypes = {
  isVisible: PropTypes.oneOf(['VISIBLE', 'INVISIBLE']).isRequired,
};

UserInfoPopup.defaultProps = {
  isVisible: 'VISIBLE',
};

export default UserInfoPopup;
