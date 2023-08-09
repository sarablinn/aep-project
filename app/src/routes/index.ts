import { Router } from '@tanstack/react-router';
import rootRoute from './rootRoute';
import indexRoute from './indexRoute';
import userProfileRoute from './userProfileRoute';
import LoadingPage from '../components/LoadingPage';
import gameComponentRoute from './gameComponentRoute';
import leadershipBoardRoute from './leadershipBoardRoute';
import eventsRoute from './eventsRoute';

const routeTree = rootRoute.addChildren([
  indexRoute,
  userProfileRoute,
  gameComponentRoute,
  leadershipBoardRoute,
  eventsRoute,
]);

export const router = new Router({
  routeTree,
  defaultPreload: 'intent',
  defaultPreloadDelay: 500,
  defaultPendingComponent: LoadingPage,
});
