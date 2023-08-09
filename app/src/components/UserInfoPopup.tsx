import { useAuth0 } from '@auth0/auth0-react';
import { useMutation } from '@tanstack/react-query';
import {
  isAvailableUsername,
  updateUser,
  UserResource,
} from '../services/userApi';
import React, { useEffect, useState } from 'react';
import { ThreeDots } from 'react-loader-spinner';
import PropTypes from 'prop-types';
import { useAtom } from 'jotai/index';
import { selectedUser } from '../services/Atoms';
import { SwatchesPicker } from 'react-color';
import useInput from '../hooks/useInput';

export type UserInfoPopupProps = {
  userResource: UserResource;
  isVisible: boolean;
};

const UserInfoPopup = ({ userResource, isVisible }: UserInfoPopupProps) => {
  const { isLoading, error } = useAuth0();

  const [showModal, setShowModal] = useState(false);
  const [visibility] = useState(isVisible || false);

  const [currentUser, setCurrentUser] = useAtom(selectedUser);

  const [username, setUsername] = useState(userResource.username);
  const [email] = useState(userResource.email);
  const [firstName, setFirstName] = useState(userResource.firstName);
  const [lastName, setLastName] = useState(userResource.lastName);
  const [bgColor, setBackgroundColor] = useState(userResource.backgroundColor);
  const [fgColor, setForegroundColor] = useState(userResource.foregroundColor);

  /**
   * Mutation that checks if a username is available (true) or in use (false).
   */
  const {
    data: checkIsAvailableUsernameResults,
    mutate: checkIsAvailableUsername,
  } = useMutation({
    mutationFn: (username: string) => isAvailableUsername(username),
    onMutate: () =>
      console.log('UserInfoPopup: Mutate: isAvailableUsername Mutation'),
    onError: (err, variables, context) => {
      console.log(err, variables, context);
    },
    onSuccess: data => {
      console.log(
        'UserInfoPopup: Success: isAvailableUsername Mutation: ',
        username,
        data,
      );
    },
  });

  /**
   * Validates username input and returns an error message string or an empty
   * string if no error.
   * @param initialValue
   * @param username
   */
  const validateUsername = (initialValue: string, username: string) => {
    if (username.trim().length == 0) {
      return ' Username required.';
    }

    if (username.trim().length < 4) {
      return ' Username must be at least 4 characters.';
    }

    if (username.trim().toLowerCase() != initialValue.toLowerCase()) {
      checkIsAvailableUsername(username);
      if (!checkIsAvailableUsernameResults) {
        return ' Username unavailable. Try a different username.';
      }
    }

    return '';
  };

  /**
   * Validates first name and last name input -- checks that the input is not empty
   * -- and returns an error message string or an empty string if no error.
   * @param initialValue
   * @param name
   */
  const validateName = (initialValue: string, name: string) => {
    console.log('UserInfoPopup: ValidateName: Initial Value: ' + initialValue);
    if (name.trim().length == 0) {
      return ' required.';
    }

    return '';
  };

  const {
    input: usernameInput,
    setStartValue: setInitialUsername,
    handleInputChange: handleUsernameChange,
    errorMessage: usernameErrMsg,
    isValid: isValidUsername,
  } = useInput(validateUsername, username);

  const {
    input: firstNameInput,
    setStartValue: setInitialFirstName,
    handleInputChange: handleFirstNameChange,
    errorMessage: firstNameErrMsg,
    isValid: isValidFirstName,
  } = useInput(validateName, firstName);

  const {
    input: lastNameInput,
    setStartValue: setInitialLastName,
    handleInputChange: handleLastNameChange,
    errorMessage: lastNameErrMsg,
    isValid: isValidLastName,
  } = useInput(validateName, lastName);

  useEffect(() => {
    console.log('USERINFOPOPUP: UseEffect set visibility: ', visibility);
    if (visibility) {
      setShowModal(true);
    }

    if (!visibility) {
      setShowModal(false);
    }
  }, [isVisible]);

  const changeUsername = (event: React.ChangeEvent<HTMLInputElement>) => {
    currentUser.username = event.target.value;
    setUsername(event.target.value);
  };

  const changeFirstName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFirstName(event.target.value);
  };

  const changeLastName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLastName(event.target.value);
  };

  const handleBackgroundChange = (event: any) => {
    currentUser.backgroundColor = event.hex;
    setBackgroundColor(event.hex);
  };
  const handleForegroundChange = (event: any) => {
    currentUser.foregroundColor = event.hex;
    setForegroundColor(event.hex);
  };

  const { mutate: updateUserMutation } = useMutation({
    mutationFn: (userResourceInput: UserResource) =>
      updateUser(userResourceInput),
    onMutate: () => console.log('UserInfoPopup: Mutate: updateUserMutation'),
    onError: (error, variables, context) => {
      console.log(error, variables, context);
    },
    onSuccess: data => {
      setCurrentUser(data);
      setShowModal(false);
      window.location.reload();
      console.log('UserInfoPopup: Success: updateUserMutation');
    },
    onSettled: () => {
      console.log('UserInfoPopup: Settled: updateUserMutation');
      if (error) {
        setShowModal(true);
      }
    },
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
      <div>
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
                            className={
                              usernameErrMsg != ''
                                ? 'mb-2 rounded-sm border border-2 border-red-600'
                                : 'mb-2 rounded-sm border border-gray-500'
                            }
                            type="text"
                            name="username-input"
                            value={usernameInput}
                            onClick={setInitialUsername}
                            onChange={handleUsernameChange}
                            onBlur={changeUsername}
                            required
                          ></input>
                          {usernameErrMsg != '' ? (
                            <span className="px-2 text-red-600"> *</span>
                          ) : (
                            <></>
                          )}

                          <div
                            style={{
                              maxWidth: '75%',
                            }}
                          >
                            {!isValidUsername ? (
                              <span
                                className="relative mb-1 ml-1 block rounded border border-red-400 bg-red-100 px-4 py-1 text-red-700"
                                role="alert"
                              >
                                <strong className="font-bold">Error:</strong>
                                <span>{usernameErrMsg}</span>
                                <span className="absolute bottom-0 right-0 top-0 px-4 py-3">
                                  <svg
                                    className="h-6 w-6 fill-current text-red-500"
                                    role="button"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                  ></svg>
                                </span>
                              </span>
                            ) : null}
                          </div>
                        </div>
                      </div>

                      <div className="flex py-4">
                        <div className="pr-3">
                          <label htmlFor="firstname-input">First Name: </label>
                        </div>
                        <input
                          className={
                            firstNameErrMsg != ''
                              ? 'rounded-sm border border-2 border-red-600'
                              : 'rounded-sm border border-gray-500'
                          }
                          type="text"
                          name="firstname-input"
                          value={firstNameInput}
                          onClick={setInitialFirstName}
                          onChange={handleFirstNameChange}
                          onBlur={changeFirstName}
                          required
                        ></input>
                        {!isValidFirstName ? (
                          <span className="px-2 text-red-600"> *</span>
                        ) : (
                          <></>
                        )}

                        {!isValidFirstName ? (
                          <span
                            className="relative mb-1 ml-1 rounded border border-red-400 bg-red-100 px-4 py-1 text-red-700"
                            role="alert"
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
                        ) : null}
                      </div>

                      <div className="flex py-4">
                        <div className="pr-3">
                          <label htmlFor="lastname-input">Last Name: </label>
                        </div>
                        <input
                          className={
                            lastNameErrMsg != ''
                              ? 'rounded-sm border border-2 border-red-600'
                              : 'rounded-sm border border-gray-500'
                          }
                          type="text"
                          name="lastname-input"
                          value={lastNameInput}
                          onClick={setInitialLastName}
                          onChange={handleLastNameChange}
                          onBlur={changeLastName}
                          required
                        ></input>
                        {!isValidLastName ? (
                          <span className="px-2 text-red-600"> *</span>
                        ) : (
                          <></>
                        )}

                        {!isValidLastName ? (
                          <span
                            className="relative mb-1 rounded border border-red-400 bg-red-100 px-4 py-1 text-red-700"
                            role="alert"
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
                        ) : null}
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
                    <button
                      className="background-transparent mb-1 mr-1 px-6 py-2 text-sm font-bold uppercase text-red-500 outline-none transition-all duration-150 ease-linear focus:outline-none"
                      type="button"
                      onClick={() => setShowModal(false)}
                    >
                      Close
                    </button>
                    <button
                      className={
                        !isValidUsername ||
                        !isValidFirstName ||
                        !isValidLastName
                          ? 'mb-1 mr-1 rounded bg-gray-400 px-6 py-3 text-sm font-bold uppercase text-white outline-none transition-all duration-150 ease-linear'
                          : 'mb-1 mr-1 rounded bg-emerald-500 px-6 py-3 text-sm font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-lg focus:outline-none active:bg-emerald-600'
                      }
                      type="button"
                      disabled={
                        (!isValidUsername ||
                          !isValidFirstName ||
                          !isValidLastName) ??
                        'disabled'
                      }
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
      </div>
    </>
  );
};

UserInfoPopup.propTypes = {
  isVisible: PropTypes.oneOf([true, false]).isRequired,
};

UserInfoPopup.defaultProps = {
  isVisible: false,
};

export default UserInfoPopup;
