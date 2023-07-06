import { useQuery } from '@tanstack/react-query';
import { getAllGamesOrderedByScore } from '../services/gameApi';
import Loading from '../utilities/Loading';
import ErrorMessage from '../utilities/ErrorMessage';

const LeadershipBoard = () => {
  const {
    isLoading: isLoadingGames,
    error: gamesError,
    data: gamesData,
  } = useQuery({
    queryKey: [`gamesByScores`],
    queryFn: () => getAllGamesOrderedByScore(),
  });

  if (isLoadingGames) {
    return (
      <div>
        <Loading />
      </div>
    );
  } else if (gamesError) {
    return (
      <div>
        <ErrorMessage
          errorMessage={'An error occurred while loading the leadership board.'}
        />
      </div>
    );
  } else if (gamesData) {
    return (
      <div className="p-5">
        <table className="bg-blue-500 p-5">
          <tr className="p-5 font-bold text-white">
            <th></th>
            <th>Score</th>
            <th>User</th>
          </tr>

          {gamesData.map((game, index) => (
            <tr>
              <td className="p-5 text-white">{index}</td>
              <td className="p-5 font-bold text-white">{game.score}</td>
              <td className="p-5 font-bold text-white">{game.user.username}</td>
            </tr>
          ))}
        </table>
      </div>
    );
  } else {
    return <></>;
  }
};

export default LeadershipBoard;
