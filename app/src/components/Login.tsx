import { useAuth0 } from '@auth0/auth0-react';
import '../styles/navbar.css';
import { useMutation } from '@tanstack/react-query';
import { UserDto, createUser, getUserByToken } from '../services/userApi';
import { useEffect } from 'react';
import { ThreeDots } from 'react-loader-spinner';
import { useAtom } from 'jotai/index';
import { selectedUser } from '../services/Atoms';
import Loading from '../utilities/Loading';

const Login = () => {
  const { user, isLoading, isAuthenticated, error, loginWithRedirect, logout } =
    useAuth0();

  const [currentUser, setCurrentUser] = useAtom(selectedUser);

  const {
    data: resultsFromGetUser,
    mutate: getUserMutation,
    isLoading: loadingUser,
  } = useMutation({
    mutationFn: (userToken: string) => getUserByToken(userToken),
    onMutate: () => console.log('mutate getUser'),
    onError: (err, variables, context) => {
      console.log(err, variables, context);
    },
    onSuccess: data => {
      if (data) {
        setCurrentUser(data);
        console.log('getUserMutation onSuccess REACHED!', currentUser);
      }
    },
    onSettled: () => {
      console.log('getUserMutation Settled.');
    },
  });

  const {
    data: resultsFromCreateUser,
    mutate: createUserMutation,
    isLoading: loadingCreateUser,
  } = useMutation({
    mutationFn: (userDto: UserDto) => createUser(userDto),
    onMutate: () => console.log('mutate createUser'),
    onError: (err, variables, context) => {
      console.log(err, variables, context);
    },
    onSettled: () => {
      console.log('createUserMutation Settled.');
    },
    onSuccess: data => {
      if (data) {
        setCurrentUser(data);
      }
    },
  });

  function getUser() {
    return new Promise(function () {
      if (isAuthenticated && user) {
        const userToken = user.sub;
        if (userToken) {
          getUserMutation(userToken);
        }
      }
    });
  }

  function addNewUser() {
    if (isAuthenticated && user && resultsFromGetUser == undefined) {
      console.log('CREATING USER: ', resultsFromGetUser);
      let username;
      let firstName: string | null;
      let lastName: string | null;

      if (user.email) {
        const emailSlice = user.email.split('@');
        username = emailSlice[0];
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

  function loadUser() {
    if (isAuthenticated && user) {
      getUser().then(addNewUser);
      console.log(currentUser);
    }
  }

  useEffect(() => {
    if (isAuthenticated && user) {
      getUser().then(addNewUser);
      console.log(currentUser);
    }
  }, [isAuthenticated]);

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
          className="login-btn"
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
        className="login-btn"
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
