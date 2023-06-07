import { Router } from '@tanstack/react-router';
import rootRoute from './rootRoute';
import indexRoute from './indexRoute';
import userRoute from './userRoute';
import rolesRoute from './rolesRoute';
import userProfileRoute from './userProfileRoute';
import LoadingPage from '../components/LoadingPage';

const routeTree = rootRoute.addChildren([
  indexRoute,
  userRoute,
  rolesRoute,
  userProfileRoute,
]);

export const router = new Router({
  routeTree,
  defaultPreload: 'intent',
  defaultPreloadDelay: 100,
  defaultPendingComponent: LoadingPage,
});
