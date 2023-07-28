import { useQuery } from '@tanstack/react-query';
import { getGamesByMode, GuestGameDto } from '../../services/gameApi';
import Loading from '../../utilities/Loading';
import ErrorMessage from '../../utilities/ErrorMessage';
import { LightenColor } from '../../services/colorChanger';
import { useState } from 'react';
import { useAtom } from 'jotai';
import { selectedUser } from '../../services/Atoms';
import PaginatedGames from './PaginatedGames';

export type GuestEndGameResultsProps = {
  game: GuestGameDto;
};

const GuestEndGameResults = ({ game }: GuestEndGameResultsProps) => {
  const [currentUser] = useAtom(selectedUser);

  const lighten_bg_5 = LightenColor(currentUser.backgroundColor, 5);
  const [bgLighter_5] = useState(lighten_bg_5);

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

        <div className="container-fluid m-10 flex flex-col p-5">
          <div
            className="container flex px-10 py-5"
            style={{
              backgroundColor: currentUser.backgroundColor,
              border: '3px solid',
              borderRadius: '20px',
              borderColor: currentUser.foregroundColor,
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
  } else {
    return <></>;
  }
};

export default GuestEndGameResults;
