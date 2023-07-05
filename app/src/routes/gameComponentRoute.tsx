import { Route } from '@tanstack/react-router';
import rootRoute from './rootRoute';
import GameSettingsPage from '../components/GameSettingsPage';

const gameComponentRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/games',
  component: () => {
    return (
      <>
        <GameSettingsPage />;
      </>
    );
  },
});

export default gameComponentRoute;
