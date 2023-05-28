import { useAuth0 } from '@auth0/auth0-react';
import '../styles/navbar.css';
import { useMutation } from '@tanstack/react-query';
import { UserDto, createUser, getUserByToken } from '../services/userApi';
import { useEffect } from 'react';
import { ThreeDots } from 'react-loader-spinner';
import { routes } from '../utilities/Constants';

const Login = () => {
  const { user, isLoading, isAuthenticated, error, loginWithRedirect, logout } =
    useAuth0();

  const { data: resultsFromGetUser, mutate: getUserMutation } = useMutation({
    mutationFn: (userToken: string) => getUserByToken(userToken),
    onMutate: () => console.log('mutate'),
    onError: (err, variables, context) => {
      console.log(err, variables, context);
    },
    onSettled: () => console.log('getUserMutation Settled.'),
  });

  const { mutate: createUserMutation } = useMutation({
    mutationFn: (userDto: UserDto) => createUser(userDto),
    onMutate: () => console.log('mutate'),
    onError: (err, variables, context) => {
      console.log(err, variables, context);
    },
    onSettled: () => console.log('createUserMutation Settled.'),
  });

  useEffect(() => {
    if (isAuthenticated && user) {
      const userToken = user.sub;
      if (userToken) {
        getUserMutation(userToken);
      }
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (!resultsFromGetUser && user) {
      console.log('CREATING USER NOW!!!!!!', resultsFromGetUser);
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
        backgroundColor: 'FFFFFF',
        foregroundColor: '000000',
      };

      createUserMutation(createUser);
      window.location.replace(
        import.meta.env.VITE_AUTH0_BASE_URL + routes.PROFILE,
      );
    }
  }, [resultsFromGetUser]);

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
          loginWithRedirect();
        }}
      >
        Log in
      </button>
    );
  }
};

export default Login;
