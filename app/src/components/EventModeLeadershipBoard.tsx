import { useQuery } from '@tanstack/react-query';
import { EventResource, getModeEventGames } from '../services/eventApi';
import Loading from '../utilities/Loading';
import ErrorMessage from '../utilities/ErrorMessage';
import PaginatedGames from './games/PaginatedGames';
import { selectedUser } from '../services/Atoms';
import { useAtom } from 'jotai';
import { ModeResource } from '../services/modeApi';

export type EventModeLeadershipBoardProps = {
  eventResource: EventResource;
  modeResource: ModeResource;
};

const EventModeLeadershipBoard = ({
  eventResource,
  modeResource,
}: EventModeLeadershipBoardProps) => {
  const [currentUser] = useAtom(selectedUser);
  // console.log(
  //   'EventModeLeadershipBoard: event and mode: ',
  //   eventResource,
  //   modeResource,
  // );
  const {
    isLoading: isLoadingModeEventGames,
    error: modeEventGamesError,
    data: modeEventGamesData,
  } = useQuery({
    queryKey: [`modeEventGamesByModes`],
    // enabled: !!eventResource && !!modeResource,
    queryFn: () =>
      getModeEventGames({
        eventId: eventResource.eventId,
        modeId: modeResource.modeId,
      }),
  });

  if (isLoadingModeEventGames) {
    return (
      <div>
        <Loading />
      </div>
    );
  } else if (modeEventGamesError) {
    return (
      <div>
        <ErrorMessage errorMessage={'An error has occurred.'} />
      </div>
    );
  } else if (modeEventGamesData) {
    console.log('EventModeLeadershipBoard: ', modeEventGamesData);
    return (
      <div className="container-fluid flex flex-col flex-wrap">
        <div
          className="m-5 h-min w-fit bg-pink-300 p-5"
          style={{
            border: '3px solid',
            borderRadius: '20px',
            borderColor: currentUser.foregroundColor,
          }}
        >
          <PaginatedGames
            tableTitle={modeResource.modeName}
            games={modeEventGamesData}
            gamesPerPage={10}
          />
        </div>
      </div>
    );
  }
  return <></>;
};

export default EventModeLeadershipBoard;
