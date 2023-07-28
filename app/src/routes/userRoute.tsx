import { Route } from '@tanstack/react-router';
// import Homepage from './../components/Homepage';
import rootRoute from './rootRoute';
import UserPage from './../components/UserPage';

const userRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/users',
  component: () => {
    return (
      <>
        <UserPage />;
      </>
    );
  },
});

export default userRoute;
