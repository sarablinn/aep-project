import { Outlet, RootRoute } from '@tanstack/react-router';
import Navbar from './../components/Navbar';
// import Homepage from './../components/Homepage';

const rootRoute = new RootRoute({
  component: () => {
    return (
      <>
        <Navbar />
        <Outlet />
      </>
    );
  },
});

export default rootRoute;
