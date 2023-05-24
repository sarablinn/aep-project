import { useAuth0 } from '@auth0/auth0-react';

const UserProfile = () => {
  const { user, isLoading, isAuthenticated, error } = useAuth0();

  console.log(user, isAuthenticated);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>ERROR: {error.message}</div>;
  }
  if (isAuthenticated) {
    return (
      <div className="container m-3 p-3">
        <p>User id: {user?.sub}</p>
        <p>Email: {user?.email}</p>
        <p>First Name: {user?.given_name}</p>
        <p>Last Name: {user?.family_name}</p>
      </div>
    );
  }
};

export default UserProfile;
