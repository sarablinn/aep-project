import { Outlet, RootRoute } from '@tanstack/react-router';
import Navbar from './../components/Navbar';

function Root() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

const rootRoute = new RootRoute({
  component: () => {
    return Root();
  },
});

export default rootRoute;
