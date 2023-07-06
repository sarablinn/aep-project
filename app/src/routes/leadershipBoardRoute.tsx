import { Route } from '@tanstack/react-router';
import rootRoute from './rootRoute';
import LeadershipBoard from '../components/LeadershipBoard';

const LeadershipBoardRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/leadershipboard',
  component: () => {
    return (
      <>
        <LeadershipBoard />;
      </>
    );
  },
});

export default LeadershipBoardRoute;
