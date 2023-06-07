import { useAuth0 } from '@auth0/auth0-react';
import '../styles/navbar.css';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getUsers, updateUser, UserResource } from '../services/userApi';
import React, { useEffect, useState } from 'react';
import { ThreeDots } from 'react-loader-spinner';
import PropTypes from 'prop-types';
import { useAtom } from 'jotai/index';
import { selectedUser } from '../services/Atoms';
import { SwatchesPicker } from 'react-color';
import useInput from '../hooks/useInput';

const UserInfoPopup = (
  { userResource }: { userResource: UserResource },
  { isVisible }: { isVisible: string },
) => {
  const { user, isLoading, error } = useAuth0();

  const [showModal, setShowModal] = useState(false);

  const [currentUser, setCurrentUser] = useAtom(selectedUser);

  const [username, setUsername] = useState(userResource.username);
  const [email] = useState(userResource.email);
  const [firstName, setFirstName] = useState(userResource.firstName);
  const [lastName, setLastName] = useState(userResource.lastName);
  const [bgColor, setBackgroundColor] = useState(userResource.backgroundColor);
  const [fgColor, setForegroundColor] = useState(userResource.foregroundColor);

  // 'hidden' or 'visible' error message div
  const [usernameErrorState, setUsernameErrorState] = useState('hidden');
  const [firstNameErrorState, setFirstNameErrorState] = useState('hidden');
  const [lastNameErrorState, setLastNameErrorState] = useState('hidden');

  /**
   * Validates username input and returns an error message string or an empty
   * string if no error.
   * @param initialValue
   * @param username
   */
  const validateUsername = (initialValue: string, username: string) => {
    console.log('VALIDATING: ' + username);
    let errorMsg = '';
    if (allUsersData) {
      if (username.trim().length == 0) {
        console.log('ValidateUser clause 1.');
        return ' Username required.';
      }

      if (username.trim().length < 4) {
        console.log('ValidateUser clause 2.');
        return ' Username must be at least 4 characters.';
      }

      allUsersData.forEach(function (userData) {
        console.log('ValidateUser clause 3: ' + userData.username);
        if (userData.username == username) {
          if (username != initialValue) {
            console.log('ValidateUser DUPLICATE USERNAME FOUND.');
            errorMsg = ' Username already in use.';
          }
        }
      });
      return errorMsg;
    }
  };

  /**
   * Validates first name and last name input -- checks that the input is not empty
   * -- and returns an error message string or an empty string if no error.
   * @param initialValue
   * @param name
   */
  const validateName = (initialValue: string, name: string) => {
    console.log('VALIDATING: ' + name);
    if (name.trim().length == 0) {
      return ' required.';
    } else {
      return '';
    }
  };

  const {
    input: usernameInput,
    setStartValue: setInitialUsername,
    handleInputChange: handleUsernameChange,
    setIsFocused: setUsernameFocus,
    errorMessage: usernameErrMsg,
    isValid: isValidUsername,
    reset: resetUsernameInput,
  } = useInput(validateUsername, username);

  useEffect(() => {
    if (usernameErrMsg != '') {
      setUsernameErrorState('visible');
    } else {
      setUsernameErrorState('hidden');
    }
  }, [usernameErrMsg]);

  const {
    input: firstNameInput,
    setStartValue: setInitialFirstName,
    handleInputChange: handleFirstNameChange,
    setIsFocused: setFirstNameFocus,
    errorMessage: firstNameErrMsg,
    isValid: isValidFirstName,
    reset: resetFirstNameInput,
  } = useInput(validateName, firstName);

  useEffect(() => {
    if (firstNameErrMsg != '') {
      setFirstNameErrorState('visible');
    } else {
      setFirstNameErrorState('hidden');
    }
  }, [firstNameErrMsg]);

  const {
    input: lastNameInput,
    setStartValue: setInitialLastName,
    handleInputChange: handleLastNameChange,
    setIsFocused: setLastNameFocus,
    errorMessage: lastNameErrMsg,
    isValid: isValidLastName,
    reset: resetLastNameInput,
  } = useInput(validateName, lastName);

  useEffect(() => {
    if (lastNameErrMsg != '') {
      setLastNameErrorState('visible');
    } else {
      setLastNameErrorState('hidden');
    }
  }, [lastNameErrMsg]);

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

  const changeFirstName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFirstName(event.target.value);
  };

  const changeLastName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLastName(event.target.value);
  };

  const handleBackgroundChange = (event: any) => {
    userResource.backgroundColor = event.hex;
    setBackgroundColor(event.hex);
  };
  const handleForegroundChange = (event: any) => {
    userResource.foregroundColor = event.hex;
    setForegroundColor(event.hex);
  };

  const {
    data: resultsFromUpdateUser,
    mutate: updateUserMutation,
    isLoading: updateUserLoading,
    error: updateUserError,
    isSuccess: updateUserSuccessful,
  } = useMutation({
    mutationFn: (userResourceInput: UserResource) =>
      updateUser(userResourceInput),
    onMutate: () => console.log('mutate updateUser'),
    onError: (error, variables, context) => {
      console.log(error, variables, context);
    },
    onSuccess: data => {
      setCurrentUser(data);
      setShowModal(false);
      window.location.reload();
    },
    onSettled: () => {
      console.log('updateUserMutation Settled.');
      if (error) {
        setShowModal(true);
        console.log('THERE WAS AN ERROR');
      }
    },
  });

  const {
    isLoading: usersLoading,
    error: errorGettingUsers,
    data: allUsersData,
  } = useQuery({
    queryKey: [`users`],
    queryFn: () => getUsers(),
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

  /**
   * Updates the user with the new changes.
   */
  function saveChangesAndReload() {
    if (isValidUsername && isValidFirstName && isValidLastName) {
      const updatedUser = {
        userId: userResource.userId,
        username: username,
        email: email,
        userToken: userResource.userToken,
        firstName: firstName,
        lastName: lastName,
        roleId: userResource.roleId,
        backgroundColor: bgColor,
        foregroundColor: fgColor,
      };
      console.log('SAVE CHANGES AND RELOAD', updatedUser);
      updateUserMutation(updatedUser);
    }
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
                <h2 className="mb-1 bg-pink-500 px-6 py-3 text-center text-sm font-bold uppercase text-white">
                  Update User Profile
                </h2>
                <div className="m-3 p-3">
                  <form>
                    <div className="flex py-4">
                      <div className="pr-3">
                        <label htmlFor="username-input">Username: </label>
                      </div>
                      <div>
                        <input
                          className="rounded-sm border border-black"
                          type="text"
                          name="username-input"
                          value={usernameInput || username}
                          onClick={setInitialUsername}
                          onFocus={setUsernameFocus}
                          onChange={handleUsernameChange}
                          onBlur={changeUsername}
                          required
                        ></input>
                        <span
                          className="relative mb-1 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700"
                          role="alert"
                          style={{ visibility: usernameErrorState || 'hidden' }}
                        >
                          <strong className="font-bold">Error:</strong>
                          <span className="block sm:inline">
                            {usernameErrMsg}
                          </span>
                          <span className="absolute bottom-0 right-0 top-0 px-4 py-3">
                            <svg
                              className="h-6 w-6 fill-current text-red-500"
                              role="button"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                            ></svg>
                          </span>
                        </span>
                      </div>
                    </div>

                    <div className="flex py-4">
                      <div className="pr-3">
                        <label htmlFor="firstname-input">First Name: </label>
                      </div>
                      <input
                        className="rounded-sm border border-black"
                        type="text"
                        name="firstname-input"
                        value={firstNameInput || firstName}
                        onClick={setInitialFirstName}
                        onFocus={setFirstNameFocus}
                        onChange={handleFirstNameChange}
                        onBlur={changeFirstName}
                        required
                      ></input>
                      <span
                        className="relative mb-1 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700"
                        role="alert"
                        style={{ visibility: firstNameErrorState || 'hidden' }}
                      >
                        <strong className="font-bold">Error:</strong>
                        <span className="block sm:inline">
                          {firstNameErrMsg}
                        </span>
                        <span className="absolute bottom-0 right-0 top-0 px-4 py-3">
                          <svg
                            className="h-6 w-6 fill-current text-red-500"
                            role="button"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                          ></svg>
                        </span>
                      </span>
                    </div>

                    <div className="flex py-4">
                      <div className="pr-3">
                        <label htmlFor="lastname-input">Last Name: </label>
                      </div>
                      <input
                        className="rounded-sm border border-black"
                        type="text"
                        name="lastname-input"
                        value={lastNameInput || lastName}
                        onClick={setInitialLastName}
                        onFocus={setLastNameFocus}
                        onChange={handleLastNameChange}
                        onBlur={changeLastName}
                        required
                      ></input>
                      <span
                        className="relative mb-1 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700"
                        role="alert"
                        style={{ visibility: lastNameErrorState || 'hidden' }}
                      >
                        <strong className="font-bold">Error:</strong>
                        <span className="block sm:inline">
                          {lastNameErrMsg}
                        </span>
                        <span className="absolute bottom-0 right-0 top-0 px-4 py-3">
                          <svg
                            className="h-6 w-6 fill-current text-red-500"
                            role="button"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                          ></svg>
                        </span>
                      </span>
                    </div>
                    <div className="m-3 flex p-3">
                      <div>
                        <p>Background Color</p>
                        <SwatchesPicker
                          className="user-profile-sketchpicker m-3 p-3"
                          color={userResource?.backgroundColor}
                          onChange={handleBackgroundChange}
                        />
                      </div>
                      <div>
                        <p>Foreground Color</p>
                        <SwatchesPicker
                          className="user-profile-sketchpicker m-3 p-3"
                          color={userResource?.foregroundColor}
                          onChange={handleForegroundChange}
                        />
                      </div>
                    </div>
                  </form>
                </div>
                <div className="flex self-center pb-3">
                  {/*<button*/}
                  {/*  className="background-transparent mb-1 mr-1 px-6 py-2 text-sm font-bold uppercase text-red-500 outline-none transition-all duration-150 ease-linear focus:outline-none"*/}
                  {/*  type="button"*/}
                  {/*  onClick={() => setShowModal(false)}*/}
                  {/*>*/}
                  {/*  Close*/}
                  {/*</button>*/}
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
