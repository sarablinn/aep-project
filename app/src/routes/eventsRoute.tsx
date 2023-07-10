import { Route } from '@tanstack/react-router';
import rootRoute from './rootRoute';
import EventsPage from '../components/EventsPage';

const eventsRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/events',
  component: () => {
    return (
      <>
        <EventsPage />;
      </>
    );
  },
});

export default eventsRoute;
