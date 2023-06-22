import { Route } from '@tanstack/react-router';
import rootRoute from './rootRoute';
import GameComponent from '../components/GameComponent';

const gameComponentRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/games',
  component: () => {
    return (
      <>
        <GameComponent />;
      </>
    );
  },
});

export default gameComponentRoute;
