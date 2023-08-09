import { useAuth0 } from '@auth0/auth0-react';
import { useMutation } from '@tanstack/react-query';
import { UserDto, createUser, getUserByToken } from '../services/userApi';
import { useEffect, useState } from 'react';
import { ThreeDots } from 'react-loader-spinner';
import { useAtom } from 'jotai/index';
import { selectedUser } from '../services/Atoms';
import { LightenColor } from '../services/colorChanger';

const Login = () => {
  const { user, isAuthenticated, error, loginWithRedirect, logout } =
    useAuth0();

  const [currentUser, setCurrentUser] = useAtom(selectedUser);

  const [isHover, setIsHover] = useState(false);

  const lighten_fg_5 = LightenColor(currentUser.foregroundColor, 5);
  const [fgLighter_5] = useState(lighten_fg_5);

  const handleMouseOver = () => {
    setIsHover(true);
  };

  const handleMouseLeave = () => {
    setIsHover(false);
  };

  /**
   * getUserMutation --> getUserByToken(userToken)
   */
  const {
    data: resultsFromGetUser,
    mutate: getUserMutation,
    isLoading: loadingUser,
  } = useMutation({
    mutationFn: (userToken: string) => getUserByToken(userToken),
    onMutate: () => console.log('Login: Mutate: getUserMutation'),
    onError: (err, variables, context) => {
      console.log(err, variables, context);
    },
    onSuccess: data => {
      if (data) {
        setCurrentUser(data);
        console.log('Login: Success: getUserMutation', currentUser);
      }
      return data;
    },
    onSettled: data => {
      console.log('Login: Settled: getUserMutation');
      if (!data) {
        if (isAuthenticated) {
          addNewUser();
        }
      }
    },
  });

  /**
   * createUserMutation --> createUser(userDto)
   */
  const { mutate: createUserMutation, isLoading: loadingCreateUser } =
    useMutation({
      mutationFn: (userDto: UserDto) => createUser(userDto),
      onMutate: () => console.log('Login: Mutate: createUserMutation'),
      onError: (err, variables, context) => {
        console.log(err, variables, context);
      },
      onSettled: () => {
        console.log('Login: Settled: createUserMutation');
      },
      onSuccess: data => {
        if (data) {
          setCurrentUser(data);
        }
      },
    });

  /**
   * Creates a UserDto, setting username to be the new user's email without the domain.
   * Backend UserService handles what happens if the given username is unavailable.
   */
  function addNewUser() {
    if (isAuthenticated && user && resultsFromGetUser == undefined) {
      console.log(
        'Login: starting process: addNewUser(): ',
        resultsFromGetUser,
      );

      let firstName: string | null;
      let lastName: string | null;
      let username = '';

      if (user) {
        if (user.email) {
          const emailSlice = user.email.split('@');
          username = emailSlice[0];
        }
      }

      if (
        user.name === user.email ||
        user.given_name == undefined ||
        user.family_name == undefined
      ) {
        firstName = '';
        lastName = '';
      } else {
        firstName = user.given_name;
        lastName = user.family_name;
      }

      const createUser = {
        username: username,
        email: user.email,
        userToken: user.sub,
        firstName: firstName,
        lastName: lastName,
        roleId: 1,
        backgroundColor: currentUser.backgroundColor,
        foregroundColor: currentUser.foregroundColor,
      };

      createUserMutation(createUser);
    }
  }

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.sub) {
        getUserMutation(user?.sub);
      }
    }
  }, [isAuthenticated, user]);

  if (loadingUser || loadingCreateUser) {
    return (
      <div className="mx-8">
        <ThreeDots height="30" width="30" color="white" ariaLabel="loading" />
      </div>
    );
  }
  if (error) {
    return <div>ERROR: {error.message}</div>;
  }

  if (isAuthenticated) {
    return (
      <div>
        <button
          style={{
            fontSize: '1.75em',
            fontWeight: 'bold',
            color: isHover ? fgLighter_5 : currentUser.foregroundColor,
          }}
          onMouseOver={handleMouseOver}
          onMouseLeave={handleMouseLeave}
          onClick={() =>
            logout({
              logoutParams: {
                returnTo: window.location.origin,
              },
            })
          }
        >
          Log out
        </button>
      </div>
    );
  } else {
    return (
      <button
        style={{
          fontSize: '1.75em',
          fontWeight: 'bold',
          color: isHover ? fgLighter_5 : currentUser.foregroundColor,
        }}
        onClick={() => {
          loginWithRedirect().then();
        }}
      >
        Log in
      </button>
    );
  }
};

export default Login;
