import Loading from '../utilities/Loading';
import ErrorMessage from '../utilities/ErrorMessage';
import { useQuery } from '@tanstack/react-query';
import { getModes, ModeResource } from '../services/modeApi';
import { useState } from 'react';
import GameComponent from './games/GameComponent';
import { useAuth0 } from '@auth0/auth0-react';

const GameSettingsPage = () => {
  const [selectedMode, setSelectedMode] = useState<ModeResource | null>(null);
  const { user } = useAuth0();

  const {
    isLoading: isLoadingModes,
    error: modesError,
    data: modesData,
  } = useQuery({
    queryKey: [`modes`],
    queryFn: () => getModes(),
  });

  if (isLoadingModes) {
    return (
      <div>
        <Loading />
      </div>
    );
  } else if (modesError) {
    return (
      <div>
        <ErrorMessage
          errorMessage={'An error has occurred while loading game settings.'}
        />
      </div>
    );
  } else if (modesData != undefined && !selectedMode) {
    return (
      <div className="container-fluid p-5">
        {modesData.map((mode, index) => (
          <button
            key={'mode-' + index}
            value={index}
            className="m-1 bg-pink-500 p-3 font-bold text-white"
            onClick={() => {
              setSelectedMode(mode);
            }}
          >
            {mode.modeName}
          </button>
        ))}
      </div>
    );
  } else if (selectedMode) {
    return <GameComponent selected_mode={selectedMode} user={user} />;
  } else {
    return <></>;
  }
};

export default GameSettingsPage;
