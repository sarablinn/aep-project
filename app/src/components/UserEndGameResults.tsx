import { GameResource } from '../services/gameApi';

export type UserEndGameResultsProps = {
  user: any;
  game: GameResource;
};

const UserEndGameResults = ({ user, game }: UserEndGameResultsProps) => {
  return (
    <div className="container flex flex-col items-center p-10">
      <h2 className="p-5 font-bold text-white">You Died.</h2>
      <h1 className="font-bold text-white">Final Score</h1>
      <h1 className="font-bold text-white">{game.score}</h1>
    </div>
  );
};

export default UserEndGameResults;
