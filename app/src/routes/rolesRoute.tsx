import { Route } from '@tanstack/react-router';
// import Homepage from './../components/Homepage';
import rootRoute from './rootRoute';
import RolesPage from './../components/RolesPage';
import { routes } from '../utilities/Constants';

const rolesRoute = new Route({
  getParentRoute: () => rootRoute,
  path: routes.ROLE,
  component: () => {
    return (
      <>
        <RolesPage />;
      </>
    );
  },
});

export default rolesRoute;
