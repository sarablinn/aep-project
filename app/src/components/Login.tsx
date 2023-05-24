import { useAuth0 } from '@auth0/auth0-react';
import '../styles/navbar.css';
import { useMutation } from '@tanstack/react-query';
import { UserDto, getOrCreateUser } from '../services/userApi';
import { useEffect } from 'react';

const Login = () => {
  const { user, isLoading, isAuthenticated, error, loginWithRedirect, logout } =
    useAuth0();

  const { data, mutate: getOrCreateUserMutation } = useMutation({
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
        username: 'username',
        email: user.email,
        userToken: user.sub,
        firstName: user.given_name,
        lastName: user.family_name,
        roleId: 2,
        backgroundColor: 'FFFFFF',
        foregroundColor: '000000',
      };
      getOrCreateUserMutation(createUser);
      console.log('REACHED POINT 1');
    }
  }, [isAuthenticated, user]);

  if (isLoading) {
    return <div>Loading...</div>;
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
          loginWithRedirect({
            // authorizationParams: [
            //   {
            //     first_name: 'first_name',
            //     storage: 'root',
            //   },
            // ],
          });
        }}
      >
        Log in
      </button>
    );
  }
};

export default Login;
