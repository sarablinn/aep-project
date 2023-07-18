import { useQuery } from '@tanstack/react-query';
import { getGamesByMode, GuestGameDto } from '../../services/gameApi';
import Loading from '../../utilities/Loading';
import ErrorMessage from '../../utilities/ErrorMessage';

export type GuestEndGameResultsProps = {
  game: GuestGameDto;
};

const GuestEndGameResults = ({ game }: GuestEndGameResultsProps) => {
  const {
    isLoading: isLoadingGames,
    error: gamesError,
    data: gamesData,
  } = useQuery({
    queryKey: [`gamesByModes`],
    queryFn: () => getGamesByMode(game.mode.modeId),
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
        <ErrorMessage errorMessage={'An error has occurred.'} />
      </div>
    );
  } else if (gamesData) {
    return (
      <div>
        <div className="container flex flex-col items-center p-10">
          <h2 className="p-5 font-bold text-white">You Died.</h2>
          <h1 className="font-bold text-white">Final Score</h1>
          <h1 className="font-bold text-white">{game.score}</h1>
        </div>

        <div className="container-fluid flex flex-col p-5">
          <div className="container flex px-10 py-5">
            <table className="p-5">
              <caption className="p-4 text-center font-bold text-white">
                {game.mode.modeName}
              </caption>
              <tbody>
                {gamesData.map((modeGame, index) => {
                  return (
                    <tr key={'modeGame-' + index}>
                      <td className="py-2 pl-5 pr-10 text-white">
                        {index + 1}
                      </td>
                      <td className="py-2 pr-5 font-bold text-white">
                        {modeGame.user.username}
                      </td>
                      <td className="py-2 font-bold text-white">
                        {modeGame.score}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  } else {
    return <></>;
  }
};

export default GuestEndGameResults;
