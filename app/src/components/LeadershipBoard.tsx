import { useQuery } from '@tanstack/react-query';
import { getAllGamesByModes } from '../services/gameApi';
import Loading from '../utilities/Loading';
import ErrorMessage from '../utilities/ErrorMessage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretLeft, faCaretRight } from '@fortawesome/free-solid-svg-icons';
import { getModes } from '../services/modeApi';

const LeadershipBoard = () => {
  const {
    isLoading: isLoadingModes,
    error: modesError,
    data: modesData,
  } = useQuery({
    queryKey: [`modes`],
    queryFn: () => getModes(),
  });

  const {
    isLoading: isLoadingGames,
    error: gamesError,
    data: gamesData,
  } = useQuery({
    queryKey: [`gamesByModes`],
    queryFn: () => getAllGamesByModes(),
  });

  if (isLoadingModes || isLoadingGames) {
    return (
      <div>
        <Loading />
      </div>
    );
  } else if (modesError || gamesError) {
    return (
      <div>
        <ErrorMessage errorMessage={'An error has occurred.'} />
      </div>
    );
  } else if (modesData && gamesData && gamesData.modeGames) {
    console.log('rendered');
    return (
      <div className="container-fluid flex flex-col p-5">
        <div className="container flex px-10 py-5">
          <table className="p-5">
            <thead>
              <tr className="text-left font-bold text-white">
                <th></th>
              </tr>
            </thead>
            <tbody>
              {gamesData.modeGames.map((games, mode_id) => {
                return (
                  <div>
                    <tr className="text-left font-bold text-white">
                      <th className="py-5">
                        {modesData?.at(mode_id)?.modeName}
                      </th>
                    </tr>
                    {games.map((game, index) => {
                      return (
                        <tr>
                          <td className="py-2 pl-5 pr-10 text-white">
                            {index + 1}
                          </td>
                          <td className="py-2 pr-5 font-bold text-white">
                            {game.user.username}
                          </td>
                          <td className="py-2 font-bold text-white">
                            {game.score}
                          </td>
                        </tr>
                      );
                    })}
                  </div>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="p-5">
          <FontAwesomeIcon
            className="fa-2x p-5 text-white"
            icon={faCaretLeft}
          />
          <FontAwesomeIcon
            className="fa-beat-fade fa-2x p-5 text-white"
            icon={faCaretRight}
          />
        </div>
      </div>
    );
  } else {
    return <></>;
  }
};

export default LeadershipBoard;
