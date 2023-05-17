import { useAuth0 } from '@auth0/auth0-react';
import '../styles/navbar.css';

const Login = () => {
  const { user, isLoading, isAuthenticated, error, loginWithRedirect, logout } =
    useAuth0();

  console.log(user, isAuthenticated);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>ERROR: {error.message}</div>;
  }
  if (isAuthenticated) {
    return (
      <div>
        <button className="login-btn" onClick={() => logout()}>
          Log out
        </button>
      </div>
    );
  } else {
    return (
      <button className="login-btn" onClick={() => loginWithRedirect()}>
        Log in
      </button>
    );
  }
};

export default Login;
