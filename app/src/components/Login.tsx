import { useAuth0 } from '@auth0/auth0-react';
import '../styles/navbar.css';
import { useMutation } from '@tanstack/react-query';
import { UserDto, getOrCreateUser } from '../services/userApi';
import { useEffect } from 'react';
import { ThreeDots } from 'react-loader-spinner';

const Login = () => {
  const { user, isLoading, isAuthenticated, error, loginWithRedirect, logout } =
    useAuth0();

  const { data: userResults, mutate: getOrCreateUserMutation } = useMutation({
    mutationFn: (userDto: UserDto) => getOrCreateUser(userDto),
    onMutate: () => console.log('mutate'),
    onError: (err, variables, context) => {
      console.log(err, variables, context);
    },
    onSettled: () => console.log('getOrCreateUserMutation Settled.'),
  });

  useEffect(() => {
    if (isAuthenticated && user) {
      const createUser = {
        username: 'username' + user.email,
        email: user.email,
        userToken: user.sub,
        firstName: user.given_name,
        lastName: user.family_name,
        roleId: 1,
        backgroundColor: 'FFFFFF',
        foregroundColor: '000000',
      };

      if (createUser.firstName == undefined) {
        createUser.firstName = '';
      }
      if (createUser.lastName == undefined) {
        createUser.lastName = '';
      }

      getOrCreateUserMutation(createUser);

      // if (userResults?.logins == 0) {
      //   window.location.replace(
      //     import.meta.env.VITE_AUTH0_BASE_URL + routes.PROFILE,
      //   );
      // }
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
