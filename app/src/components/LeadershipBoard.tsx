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
      <div>
        <table>
          {gamesData.map((game, index) => (
            <tr>
              <td>{index}</td>
              <td>{game.score}</td>
              <td>{game.user_id}</td>
            </tr>
          ))}
        </table>
      </div>
    );
  }
};

export default LeadershipBoard;
