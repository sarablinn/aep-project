import { Router } from '@tanstack/react-router';
import rootRoute from './rootRoute';
import indexRoute from './indexRoute';
import userRoute from './userRoute';
import rolesRoute from './rolesRoute';

const routeTree = rootRoute.addChildren([indexRoute, userRoute, rolesRoute]);

export const router = new Router({
  routeTree,
  defaultPreload: 'intent',
});
