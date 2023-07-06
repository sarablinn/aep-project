import { GameResource } from '../services/gameApi';

export type UserEndGameResultsProps = {
  user: any;
  game: GameResource;
};

const UserEndGameResults = ({ user, game }: UserEndGameResultsProps) => {
  return (
    <div>
      <h2>You Died.</h2>
      <h1>Final Score</h1>
      <h1>{game.score}</h1>
    </div>
  );
};

export default UserEndGameResults;
