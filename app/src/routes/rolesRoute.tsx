import { Route } from '@tanstack/react-router';
// import Homepage from './../components/Homepage';
import rootRoute from './rootRoute';
import RolesPage from './../components/RolesPage';

const rolesRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/roles',
  component: () => {
    return (
      <>
        <RolesPage />;
      </>
    );
  },
});

export default rolesRoute;
