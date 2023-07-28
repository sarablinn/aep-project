import { Route } from '@tanstack/react-router';
import rootRoute from './rootRoute';
import UserProfile from '../components/UserProfile';

const userProfileRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/profile',
  component: () => {
    return (
      <>
        <UserProfile />;
      </>
    );
  },
});

export default userProfileRoute;
