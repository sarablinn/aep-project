import { GameResource, getGamesByMode } from '../../services/gameApi';
import { EventResource, getModeEventGames } from '../../services/eventApi';
import { useQuery } from '@tanstack/react-query';
import Loading from '../../utilities/Loading';
import ErrorMessage from '../../utilities/ErrorMessage';
import { useAtom } from 'jotai';
import { selectedUser } from '../../services/Atoms';

export type UserEndGameResultsProps = {
  user: any;
  game: GameResource;
  event: EventResource | null | undefined;
};

/**
 * Displays the final score of the completed game, the leadership board
 * for the completed game's mode and a leadership board for the event
 * (only games by the same mode), if the user selected one.
 * @param user
 * @param game
 * @param event
 * @constructor
 */
const UserEndGameResults = ({ user, game, event }: UserEndGameResultsProps) => {
  const [currentUser] = useAtom(selectedUser);

  const {
    isLoading: isLoadingGames,
    error: gamesError,
    data: gamesData,
  } = useQuery({
    queryKey: [`gamesByModes`],
    queryFn: () => getGamesByMode(game.mode.modeId),
  });

  const {
    isLoading: isLoadingEventGames,
    error: eventGamesError,
    data: eventGamesData,
  } = useQuery({
    queryKey: [`eventGamesByModes`],
    enabled: !!event,
    queryFn: () =>
      getModeEventGames({
        eventId: event!.eventId,
        modeId: game.mode.modeId,
      }),
  });

  if (isLoadingGames || isLoadingEventGames) {
    return (
      <div>
        <Loading />
      </div>
    );
  } else if (gamesError || eventGamesError) {
    return (
      <div>
        <ErrorMessage errorMessage={'An error has occurred.'} />
      </div>
    );
  } else if (gamesData) {
    return (
      <div>
        <div className="container flex flex-col items-center p-10">
          <h2
            className="p-5 font-bold"
            style={{ color: currentUser.foregroundColor }}
          >
            You Died.
          </h2>
          <h1
            className="font-bold text-white"
            style={{ color: currentUser.foregroundColor }}
          >
            Final Score
          </h1>
          <h1
            className="font-bold text-white"
            style={{ color: currentUser.foregroundColor }}
          >
            {game.score}
          </h1>
        </div>

        <div className="container-fluid flex p-5">
          <div
            className="container flex px-10 py-5"
            style={{ height: 'max-content' }}
          >
            <table className="p-5">
              <caption className="p-4 text-center font-bold text-white">
                {game.mode.modeName}
              </caption>
              <tbody>
                {gamesData.map((modeGame, index) => {
                  if (modeGame.gameId === game.gameId) {
                    return (
                      <tr key={'modeGame-' + index}>
                        <td className="bg-blue-400 py-2 pl-5 pr-10 font-bold text-white">
                          {index + 1}
                        </td>
                        <td className="bg-blue-400 py-2 pr-5 font-bold text-white">
                          {modeGame.user.username}
                        </td>
                        <td className="bg-blue-400 py-2 pr-5 font-bold text-white">
                          {modeGame.score}
                        </td>
                      </tr>
                    );
                  } else {
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
                  }
                })}
              </tbody>
            </table>
          </div>

          {event && eventGamesData ? (
            <div
              className="container flex px-10 py-5"
              style={{ height: 'max-content' }}
            >
              <table className="p-5">
                <caption className="p-4 text-center font-bold text-white">
                  {event.eventName} {game.mode.modeName}
                </caption>
                <tbody>
                  {eventGamesData.map((eventGame, index) => {
                    if (eventGame.gameId === game.gameId) {
                      return (
                        <tr key={'modeGame-' + index}>
                          <td className="bg-blue-400 py-2 pl-5 pr-10 font-bold text-white">
                            {index + 1}
                          </td>
                          <td className="bg-blue-400 py-2 pr-5 font-bold text-white">
                            {eventGame.user.username}
                          </td>
                          <td className="bg-blue-400 py-2 pr-5 font-bold text-white">
                            {eventGame.score}
                          </td>
                          <td className="bg-blue-400 py-2 pr-5 font-bold text-white">
                            {eventGame.mode.modeName}
                          </td>
                        </tr>
                      );
                    } else {
                      return (
                        <tr key={'modeGame-' + index}>
                          <td className="py-2 pl-5 pr-10 text-white">
                            {index + 1}
                          </td>
                          <td className="py-2 pr-5 font-bold text-white">
                            {eventGame.user.username}
                          </td>
                          <td className="py-2 font-bold text-white">
                            {eventGame.score}
                          </td>
                        </tr>
                      );
                    }
                  })}
                </tbody>
              </table>
            </div>
          ) : null}
        </div>
      </div>
    );
  } else {
    return <></>;
  }
};

export default UserEndGameResults;
