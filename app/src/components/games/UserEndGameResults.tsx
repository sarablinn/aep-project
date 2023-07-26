import { GameResource, getGamesByMode } from '../../services/gameApi';
import { EventResource, getModeEventGames } from '../../services/eventApi';
import { useQuery } from '@tanstack/react-query';
import Loading from '../../utilities/Loading';
import ErrorMessage from '../../utilities/ErrorMessage';
import { useAtom } from 'jotai';
import { selectedUser } from '../../services/Atoms';
import PaginatedGames from './PaginatedGames';
import { LightenColor } from '../../services/colorChanger';
import { useState } from 'react';

export type UserEndGameResultsProps = {
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
const UserEndGameResults = ({ game, event }: UserEndGameResultsProps) => {
  const [currentUser] = useAtom(selectedUser);
  const [hasEvent] = useState<boolean>(!!event);

  const lighten_bg_5 = LightenColor(currentUser.backgroundColor, 5);
  const [bgLighter_5] = useState(lighten_bg_5);

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

  const {
    isLoading: isLoadingGames,
    error: gamesError,
    data: gamesData,
  } = useQuery({
    queryKey: [`gamesByModes`],
    queryFn: () => getGamesByMode(game.mode.modeId),
  });

  if (isLoadingGames || isLoadingEventGames) {
    console.log('IS LOADING: ', isLoadingGames, isLoadingEventGames);
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
  }
  // else if (
  //   (gamesData && event && eventGamesData) ||
  //   (gamesData && !event && !eventGamesData)
  // ) {
  else if (gamesData && hasEvent && eventGamesData) {
    console.log('EVENT GAMES DATA: ', eventGamesData);
    return (
      <div>
        <div
          className="container flex flex-col items-center p-10"
          style={{
            backgroundColor: bgLighter_5,
            border: '3px solid',
            borderRadius: '20px',
            borderColor: currentUser.foregroundColor,
          }}
        >
          <h2
            className="p-5 font-bold"
            style={{ color: currentUser.foregroundColor }}
          >
            YOU DIED.
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
            className="container m-5 flex px-10 py-5"
            style={{
              backgroundColor: currentUser.backgroundColor,
              border: '3px solid',
              borderRadius: '20px',
              borderColor: currentUser.foregroundColor,
              height: 'max-content',
            }}
          >
            <PaginatedGames
              tableTitle={game.mode.modeName}
              completedGame={game}
              games={gamesData}
              gamesPerPage={10}
            />
          </div>

          {event && eventGamesData ? (
            <div
              className="container m-5 flex px-10 py-5"
              style={{
                backgroundColor: currentUser.backgroundColor,
                border: '3px solid',
                borderRadius: '20px',
                borderColor: currentUser.foregroundColor,
                height: 'max-content',
              }}
            >
              <PaginatedGames
                tableTitle={event.eventName + ':  ' + game.mode.modeName}
                completedGame={game}
                games={eventGamesData}
                gamesPerPage={10}
              />
            </div>
          ) : null}
        </div>
      </div>
    );
  } else if (!event && gamesData) {
    return (
      <div>
        <div
          className="container flex flex-col items-center p-10"
          style={{
            backgroundColor: bgLighter_5,
            border: '3px solid',
            borderRadius: '20px',
            borderColor: currentUser.foregroundColor,
          }}
        >
          <h2
            className="p-5 font-bold"
            style={{ color: currentUser.foregroundColor }}
          >
            YOU DIED.
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
            className="container m-5 flex px-10 py-5"
            style={{
              backgroundColor: currentUser.backgroundColor,
              border: '3px solid',
              borderRadius: '20px',
              borderColor: currentUser.foregroundColor,
              height: 'max-content',
            }}
          >
            <PaginatedGames
              tableTitle={game.mode.modeName}
              completedGame={game}
              games={gamesData}
              gamesPerPage={10}
            />
          </div>
        </div>
      </div>
    );
  }

  return <></>;
};

export default UserEndGameResults;
